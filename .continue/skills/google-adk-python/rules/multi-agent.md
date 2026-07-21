---
title: Multi-Agent Orchestration
impact: MEDIUM
tags: google-adk-python
---

# Multi-Agent Orchestration

> Coordinate specialized agents for complex tasks.

---

## Coordinator Pattern

```python
from google.adk.agents import LlmAgent
from google.adk.tools import google_search

# Specialized agents
researcher = LlmAgent(
    name="Researcher",
    model="gemini-3-flash",
    instruction="Research topics thoroughly. Provide detailed summaries with sources.",
    tools=[google_search]
)

writer = LlmAgent(
    name="Writer",
    model="gemini-3-flash",
    instruction="Write clear, engaging content."
)

editor = LlmAgent(
    name="Editor",
    model="gemini-3-flash",
    instruction="Review and improve writing quality."
)

# Coordinator delegates to specialists
coordinator = LlmAgent(
    name="Coordinator",
    model="gemini-3-flash",
    instruction="""You coordinate a content team:
    1. Delegate research to Researcher
    2. Send findings to Writer
    3. Have Editor review final output""",
    sub_agents=[researcher, writer, editor]
)
```

---

## Sequential Workflow

```python
from google.adk.agents import SequentialAgent

# Pipeline: each agent processes output from previous
pipeline = SequentialAgent(
    name="content_pipeline",
    agents=[researcher, writer, editor]
)

result = pipeline.run("Create article about AI agents")
```

**Use when:** Order matters, each stage depends on previous.

---

## Parallel Execution

```python
from google.adk.agents import ParallelAgent

# All agents run simultaneously
parallel = ParallelAgent(
    name="parallel_research",
    agents=[web_researcher, paper_researcher, expert_researcher]
)

results = parallel.run("Gather data on quantum computing")
```

**Use when:** Tasks are independent, reduce latency.

---

## Loop Agent

```python
from google.adk.agents import LoopAgent

# Repeat until condition met
refiner = LoopAgent(
    name="quality_refiner",
    agent=editor,
    max_iterations=3,
    stop_condition="Quality score > 0.9"
)
```

**Use when:** Iterative improvement needed.

---

## Customer Support Router

```python
billing_agent = LlmAgent(
    name="BillingAgent",
    instruction="Handle billing, refunds, payments.",
    tools=[check_invoice, process_refund]
)

technical_agent = LlmAgent(
    name="TechnicalAgent",
    instruction="Troubleshoot technical issues.",
    tools=[check_status, create_ticket]
)

router = LlmAgent(
    name="SupportRouter",
    instruction="Route queries to appropriate specialist.",
    sub_agents=[billing_agent, technical_agent]
)

# Router auto-delegates based on query
response = router.run("I was charged twice")
# ? Routes to billing_agent
```

---

## Best Practices

| Practice | Application |
|----------|-------------|
| Named agents | Use descriptive names in instructions |
| Clear delegation | Explicit routing in coordinator |
| Error handling | Handle agent failures gracefully |
| State management | Pass context between agents |

---

? PikaKit v3.9.206
