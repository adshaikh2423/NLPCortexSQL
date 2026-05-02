import os
import re
import psycopg2
import pandas as pd
import json
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from backend.core.config import settings
from backend.db.models import DynamicTable, Base

def get_sqlalchemy_engine():
    url = settings.DATABASE_URL
    if url and "pgbouncer=true" in url:
        url = url.replace("?pgbouncer=true", "")
    return create_engine(url)

def get_db_session():
    engine = get_sqlalchemy_engine()
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    return SessionLocal()

def get_db_connection():
    try:
        url = settings.DATABASE_URL
        if url and "pgbouncer=true" in url:
            url = url.replace("?pgbouncer=true", "")
        conn = psycopg2.connect(url)
        return conn
    except Exception as e:
        print(f"Error connecting to database: {e}")
        return None

def ingest_dataframe(df, table_name, user_id, original_filename=None):
    engine = get_sqlalchemy_engine()
    session = get_db_session()
    try:
        df.to_sql(table_name, engine, if_exists='replace', index=False)
        columns_info = json.dumps(df.dtypes.apply(lambda x: str(x)).to_dict())
        row_count = len(df)
        
        existing = session.query(DynamicTable).filter(DynamicTable.table_name == table_name).first()
        if existing:
            existing.user_id = user_id
            existing.original_filename = original_filename or existing.original_filename
            existing.columns_info = columns_info
            existing.row_count = row_count
        else:
            new_meta = DynamicTable(
                user_id=user_id,
                table_name=table_name,
                original_filename=original_filename,
                columns_info=columns_info,
                row_count=row_count
            )
            session.add(new_meta)
        
        session.commit()
        return True, f"Table '{table_name}' ingested and mapped to NLP2SQL knowledge base."
    except Exception as e:
        session.rollback()
        return False, str(e)
    finally:
        session.close()

def fetch_db_schema(user_id=None):
    conn = get_db_connection()
    if not conn:
        return "Could not connect to database."
    
    session = get_db_session()
    try:
        user_tables = session.query(DynamicTable.table_name).filter(DynamicTable.user_id == user_id).all()
        user_table_list = [t[0] for t in user_tables]
        
        if not user_table_list:
            return "No user-uploaded tables found. Please upload data to begin."

        placeholders = ', '.join(["%s"] * len(user_table_list))
        query = f"""
        SELECT table_name, column_name, data_type 
        FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name IN ({placeholders})
        ORDER BY table_name;
        """
        
        with conn.cursor() as cur:
            cur.execute(query, user_table_list)
            rows = cur.fetchall()
    finally:
        session.close()
        conn.close()
    
    schema_text = "Your Knowledge Base (Uploaded Tables):\n"
    current_table = ""
    for table, col, dtype in rows:
        if table != current_table:
            schema_text += f"\nTable: {table}\n"
            current_table = table
        schema_text += f" - {col} ({dtype})\n"
    
    return schema_text

def execute_query(sql_query, user_id=None):
    conn = get_db_connection()
    if not conn:
        return None, "Database connection failed."
    
    if user_id:
        session = get_db_session()
        user_tables = session.query(DynamicTable.table_name).filter(DynamicTable.user_id == user_id).all()
        user_table_list = [t[0].lower() for t in user_tables]
        session.close()

        used_tables = re.findall(r'FROM\s+"?(\w+)"?|JOIN\s+"?(\w+)"?', sql_query, re.IGNORECASE)
        flat_used = [t for tup in used_tables for t in tup if t]
        
        for ut in flat_used:
            if ut.lower() not in user_table_list and ut.lower() not in ['users', 'products', 'orders']:
                 return None, f"Security Violation: Access denied to table '{ut}'."

    try:
        all_results = []
        with conn.cursor() as cur:
            statements = [s.strip() for s in sql_query.split(';') if s.strip()]
            for statement in statements:
                cur.execute(statement)
                if cur.description:
                    colnames = [desc[0] for desc in cur.description]
                    rows = cur.fetchall()
                    all_results.append({
                        "columns": colnames,
                        "rows": rows
                    })
            if not all_results:
                return [], ""
            return all_results, ""
    except Exception as e:
        return None, str(e)
    finally:
        conn.close()
