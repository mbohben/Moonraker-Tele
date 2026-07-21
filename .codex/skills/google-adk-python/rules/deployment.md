---
title: Deployment Patterns
impact: MEDIUM
tags: google-adk-python
---

# Deployment Patterns

> Deploy agents to Cloud Run, Vertex AI, or custom infrastructure.

---

## Cloud Run

```dockerfile
# Dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["python", "agent_server.py"]
```

```python
# agent_server.py
from fastapi import FastAPI
from google.adk.agents import LlmAgent

app = FastAPI()

agent = LlmAgent(
    name="api_agent",
    model="gemini-3-flash",
    instruction="Helpful assistant."
)

@app.post("/chat")
async def chat(message: str):
    return {"response": agent.run(message)}
```

```bash
# Deploy
docker build -t my-agent .
gcloud run deploy my-agent \
  --image my-agent \
  --region us-central1 \
  --set-env-vars GEMINI_API_KEY=$GEMINI_API_KEY
```

---

## Vertex AI Agent Engine

```python
# Managed infrastructure with:
# - Scalable hosting
# - Monitoring and logging
# - Version management
# - Production-ready infra

from google.cloud import aiplatform

aiplatform.init(project="my-project", location="us-central1")

# Deploy agent to Vertex AI
# (Follow Vertex AI Agent Builder docs)
```

---

## Local Development

```python
if __name__ == "__main__":
    agent = LlmAgent(
        name="dev_agent",
        model="gemini-3-flash",
        instruction="Development assistant."
    )

    # Interactive loop
    while True:
        user_input = input("You: ")
        if user_input.lower() == "quit":
            break
        response = agent.run(user_input)
        print(f"Agent: {response}")
```

---

## Environment Variables

```bash
# Required
GEMINI_API_KEY=your_api_key

# OR for Vertex AI
GOOGLE_CLOUD_PROJECT=your_project
GOOGLE_CLOUD_LOCATION=us-central1
```

---

## Health Check

```python
@app.get("/health")
async def health():
    return {"status": "healthy"}

@app.get("/ready")
async def ready():
    # Check agent is ready
    try:
        agent.run("test")
        return {"status": "ready"}
    except Exception as e:
        return {"status": "not ready", "error": str(e)}
```

---

## Best Practices

| Practice | Application |
|----------|-------------|
| **Health checks** | Implement /health and /ready |
| **Env vars** | Never hardcode API keys |
| **Logging** | Log agent requests/responses |
| **Monitoring** | Track latency, errors, usage |
| **Scaling** | Use Cloud Run auto-scaling |

---

? PikaKit v3.9.206
