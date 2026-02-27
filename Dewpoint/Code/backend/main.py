from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from transformers import pipeline

app = FastAPI(title="Dewpoint Brains")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

generator = pipeline("text-generation", model="nomic-ai/gpt4all-j")

class CommandRequest(BaseModel):
    command: str

def ai_response(prompt):
    output = generator(prompt, max_length=300)
    return output[0]['generated_text']

@app.post("/summary")
async def summary(request: CommandRequest):
    prompt = f"Generator a personalized progress summary for these tasks: {request.command}"
    return {"result": ai_response(prompt)}

@app.post("/breakdown")
async def breakdown(request: CommandRequest):
    prompt = f"Suggest task breakdowns for these goals and tasks: {request.command}"
    return {"result": ai_response(prompt)}

@app.post("/bottlenecks")
async def bottlenecks(request: CommandRequest):
    prompt = f"Identify bottlenecks in these tasks and suggest mitigation strategies: {request.command}"
    return {"result": ai_response(prompt)}

@app.post("/schedule")
async def schedule(request: CommandRequest):
    prompt = f"Create an AI-optimized schedule for these tasks: {request.command}"
    return {"result": ai_response(prompt)}