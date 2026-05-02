"""
Multi-Agent System for NL2SQL
Architecture: Supervisor -> Reasoning -> Reflection -> Executor -> Formatter
"""
import os
import json
import re
from typing import TypedDict, List, Literal, Annotated
from google import genai
from langgraph.graph import StateGraph, END
from backend.db import session as database
from backend.core.config import settings
from transformers import T5Tokenizer, T5ForConditionalGeneration
import torch

# Initialize the Official Google GenAI Client
client = genai.Client(api_key=settings.GEMINI_API_KEY)
MODEL_ID = settings.MODEL_ID

# ============================================================================
# LOCAL ML MODEL INITIALIZATION
# ============================================================================
LOCAL_MODEL_READY = False
try:
    current_dir = os.path.dirname(os.path.abspath(__file__))
    model_path = os.path.join(os.path.dirname(current_dir), "fine_tuned_sql_model")
    
    if os.path.exists(model_path) and os.path.isdir(model_path):
        print(f"Loading Local ML Model from: {os.path.basename(model_path)}...")
        local_tokenizer = T5Tokenizer.from_pretrained(model_path)
        local_model = T5ForConditionalGeneration.from_pretrained(model_path)
        LOCAL_MODEL_READY = True
        print("Local Model Loaded and Ready.")
except Exception as e:
    print(f"Local model initialization skipped: {e}")

# ============================================================================
# STATE DEFINITION
# ============================================================================
class MultiAgentState(TypedDict):
    user_query: str
    db_schema: str
    available_tables: List[str]
    target_tables: List[str]
    query_type: str
    query_plan: str
    generated_sql: str
    reflection_notes: str
    query_results: List
    query_columns: List[str]
    error_message: str
    iteration_count: int
    final_answer: str
    next_agent: str
    is_ambiguous: bool
    potential_matches: List[str]
    user_id: int
    last_failed_sql: str

# ============================================================================
# AGENTS
# ============================================================================

def supervisor_agent(state: MultiAgentState) -> MultiAgentState:
    print("🎯 SUPERVISOR: Analyzing query context...")
    if "No user-uploaded tables found" in state['db_schema']:
        state['final_answer'] = "Protocol Interrupted: No active knowledge base detected. Please upload data."
        state['next_agent'] = END
        return state

    user_tables = re.findall(r"Table:\s*(\w+)", state['db_schema'], re.IGNORECASE)
    prompt = f"""You are a SQL Architect Supervisor.
Analyze this request: "{state['user_query']}"
AVAILABLE TABLES: {user_tables}
SCHEMA DETAILS:
{state['db_schema']}

Return JSON ONLY:
{{
    "target_tables": ["table1"],
    "query_type": "single|join|aggregation",
    "is_ambiguous": true/false,
    "confidence_score": 0.0-1.0,
    "reasoning": "Brief explanation"
}}
"""
    try:
        response = client.models.generate_content(model=MODEL_ID, contents=prompt)
        text = response.text
        json_match = re.search(r'\{.*\}', text, re.DOTALL)
        data = json.loads(json_match.group(0)) if json_match else {"target_tables": [], "is_ambiguous": True}
        
        state['target_tables'] = data.get("target_tables", [])
        state['query_type'] = data.get("query_type", "single")
        state['is_ambiguous'] = data.get("is_ambiguous", False)

        if not state['target_tables']:
            for table in user_tables:
                if table.lower() in state['user_query'].lower():
                    state['target_tables'] = [table]
                    state['is_ambiguous'] = False
                    break

        if state['is_ambiguous'] and len(user_tables) > 1:
            state['potential_matches'] = user_tables
            state['next_agent'] = END
            return state

        state['next_agent'] = "reasoning"
    except Exception as e:
        state['next_agent'] = "reasoning"
    return state

def reasoning_agent(state: MultiAgentState) -> MultiAgentState:
    print("🧠 REASONING: Building query plan...")
    local_draft_sql = ""
    if LOCAL_MODEL_READY:
        try:
            input_text = f"translate English to SQL: {state['user_query']} \n Context: {state['db_schema']}"
            inputs = local_tokenizer(input_text, return_tensors="pt", max_length=512, truncation=True)
            with torch.no_grad():
                outputs = local_model.generate(**inputs, max_length=512)
            local_draft_sql = local_tokenizer.decode(outputs[0], skip_special_tokens=True)
        except Exception as e:
            print(f"⚠️ Local Model Error: {e}")
    
    error_feedback = f"\n❌ PREVIOUS FAILED SQL: {state.get('last_failed_sql')}\nERROR: {state['error_message']}" if state['error_message'] else ""
    prompt = f"""You are a Senior SQL Architect. 
USER REQUEST: {state['user_query']}
SCHEMA CONTEXT:
{state['db_schema']}
{error_feedback}
{f'LOCAL DRAFT: {local_draft_sql}' if local_draft_sql else ''}

Format:
LOGIC_PATH: [Step-by-step logic]
SQL: [Your PostgreSQL Query]
"""
    try:
        response = client.models.generate_content(model=MODEL_ID, contents=prompt)
        content = response.text
        if "SQL:" in content:
            state['query_plan'] = content.split("SQL:")[0].replace("LOGIC_PATH:", "").strip()
            sql_block = content.split("SQL:")[1].strip()
            state['generated_sql'] = re.sub(r'```sql\n?|```', '', sql_block).strip()
        else:
            state['generated_sql'] = content.strip()
    except Exception as e:
        state['error_message'] = str(e)
    state['next_agent'] = "reflection"
    return state

def reflection_agent(state: MultiAgentState) -> MultiAgentState:
    print("🔍 REFLECTION: Validating SQL...")
    if not state.get('generated_sql'):
        state['next_agent'] = "reasoning"
        return state
    prompt = f"Validate this SQL against the schema. SQL: {state['generated_sql']}\nSCHEMA: {state['db_schema']}\nReturn APPROVED or NEEDS_REVISION with critique."
    try:
        response = client.models.generate_content(model=MODEL_ID, contents=prompt)
        feedback = response.text
        state['reflection_notes'] = feedback
        if "NEEDS_REVISION" in feedback and state['iteration_count'] < 3:
            state['iteration_count'] += 1
            state['error_message'] = feedback
            state['last_failed_sql'] = state['generated_sql']
            state['next_agent'] = "reasoning"
        else:
            state['next_agent'] = "executor"
    except:
        state['next_agent'] = "executor"
    return state

def executor_agent(state: MultiAgentState) -> MultiAgentState:
    print("⚡ EXECUTOR: Running SQL...")
    sql = state.get('generated_sql', "").strip()
    if not sql:
        state['next_agent'] = "formatter"
        return state
    try:
        all_res, err = database.execute_query(sql, user_id=state.get('user_id'))
        if all_res is not None:
            state['query_results'] = all_res
            state['error_message'] = ""
            state['next_agent'] = "formatter"
        else:
            state['error_message'] = err
            state['last_failed_sql'] = sql
            state['next_agent'] = "reasoning" if state['iteration_count'] < 3 else "formatter"
            state['iteration_count'] += 1
    except Exception as e:
        state['error_message'] = str(e)
        state['next_agent'] = "formatter"
    return state

def formatter_agent(state: MultiAgentState) -> MultiAgentState:
    print("📝 FORMATTER: Finalizing answer...")
    if state['error_message'] and not state['query_results']:
        state['final_answer'] = f"Error executing query: {state['error_message']}"
        state['next_agent'] = END
        return state
    
    prompt = f"Explain these results for the query: {state['user_query']}\nDATA: {str(state['query_results'][:2])}"
    try:
        response = client.models.generate_content(model=MODEL_ID, contents=prompt)
        state['final_answer'] = response.text
    except:
        state['final_answer'] = "Query successful. Results attached."
    state['next_agent'] = END
    return state

def create_multi_agent_graph():
    workflow = StateGraph(MultiAgentState)
    workflow.add_node("supervisor", supervisor_agent)
    workflow.add_node("reasoning", reasoning_agent)
    workflow.add_node("reflection", reflection_agent)
    workflow.add_node("executor", executor_agent)
    workflow.add_node("formatter", formatter_agent)
    workflow.set_entry_point("supervisor")
    workflow.add_conditional_edges("supervisor", lambda x: x['next_agent'], {"reasoning": "reasoning", END: END})
    workflow.add_conditional_edges("reasoning", lambda x: x['next_agent'], {"reflection": "reflection", END: END})
    workflow.add_conditional_edges("reflection", lambda x: x['next_agent'], {"reasoning": "reasoning", "executor": "executor", END: END})
    workflow.add_conditional_edges("executor", lambda x: x['next_agent'], {"reasoning": "reasoning", "formatter": "formatter", END: END})
    workflow.add_conditional_edges("formatter", lambda x: x['next_agent'], {END: END})
    return workflow.compile()

graph = create_multi_agent_graph()

def run_multi_agent_query(query: str, schema: str, user_id: int = None) -> dict:
    initial_state: MultiAgentState = {
        "user_query": query,
        "db_schema": schema,
        "available_tables": [],
        "target_tables": [],
        "query_type": "single",
        "query_plan": "",
        "generated_sql": "",
        "reflection_notes": "",
        "query_results": [],
        "query_columns": [],
        "error_message": "",
        "iteration_count": 0,
        "final_answer": "",
        "next_agent": "supervisor",
        "is_ambiguous": False,
        "potential_matches": [],
        "user_id": user_id,
        "last_failed_sql": ""
    }
    return graph.invoke(initial_state)
