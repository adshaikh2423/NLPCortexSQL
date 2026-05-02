from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
import pandas as pd
import io
from typing import Annotated

from backend.db import session as database
from backend.core import auth
from backend.agents import multi_agent
from backend.db.models import User
from backend.core.config import settings

app = FastAPI(title=settings.PROJECT_NAME)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

async def get_current_user(token: Annotated[str, Depends(oauth2_scheme)]):
    payload = auth.decode_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid session")
    username = payload.get("sub")
    db = database.get_db_session()
    user = db.query(User).filter(User.username == username).first()
    db.close()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user

@app.post("/signup")
async def signup(username: str = Form(...), email: str = Form(...), password: str = Form(...)):
    db = database.get_db_session()
    if db.query(User).filter(User.username == username).first():
        db.close()
        raise HTTPException(status_code=400, detail="Username is already taken")
    if db.query(User).filter(User.email == email).first():
        db.close()
        raise HTTPException(status_code=400, detail="Email is already registered")
    try:
        hashed_pass = auth.get_password_hash(password)
        new_user = User(username=username, email=email, hashed_password=hashed_pass)
        db.add(new_user)
        db.commit()
        return {"message": "User created successfully"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    finally:
        db.close()

@app.post("/login")
async def login(form_data: Annotated[OAuth2PasswordRequestForm, Depends()]):
    db = database.get_db_session()
    user = db.query(User).filter(User.username == form_data.username).first()
    if not user or not auth.verify_password(form_data.password, user.hashed_password):
        db.close()
        raise HTTPException(status_code=401, detail="Invalid username or password")
    access_token = auth.create_access_token(data={"sub": user.username})
    db.close()
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/upload")
async def upload_file(
    file: UploadFile = File(...), 
    table_name: str = Form(...),
    user: User = Depends(get_current_user)
):
    try:
        content = await file.read()
        if file.filename.endswith('.csv'):
            df = pd.read_csv(io.BytesIO(content))
        elif file.filename.endswith(('.xlsx', '.xls')):
            df = pd.read_excel(io.BytesIO(content))
        else:
            raise HTTPException(status_code=400, detail="Invalid file type")
        
        success, message = database.ingest_dataframe(df, table_name, user.id, file.filename)
        if not success:
            raise HTTPException(status_code=500, detail=message)
        return {"message": message, "table_name": table_name}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/schema")
async def get_schema(user: User = Depends(get_current_user)):
    return {"schema": database.fetch_db_schema(user.id)}

@app.post("/chat")
async def chat(query: str = Form(...), user: User = Depends(get_current_user)):
    try:
        schema = database.fetch_db_schema(user.id)
        result = multi_agent.run_multi_agent_query(query, schema, user.id)
        
        if result.get('is_ambiguous'):
            return {
                "answer": "Multiple potential matches found. Please specify.",
                "is_ambiguous": True,
                "potential_matches": result.get('potential_matches', [])
            }

        datasets = []
        for res in result.get('query_results', []):
            cols = res.get('columns', [])
            rows = res.get('rows', [])
            datasets.append([dict(zip(cols, row)) for row in rows])

        return {
            "answer": result['final_answer'],
            "sql": result.get('generated_sql'),
            "data": datasets,
            "plan": result.get('query_plan'),
            "reflection": result.get('reflection_notes')
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
