---
title: Custom Tools
impact: MEDIUM
tags: google-adk-python
---

# Custom Tools

> Extend agents with domain-specific capabilities.

---

## From Python Function

```python
from google.adk.tools import Tool

def calculate_roi(revenue: float, cost: float) -> float:
    """Calculate return on investment percentage.

    Args:
        revenue: Total revenue from investment
        cost: Total cost of investment

    Returns:
        ROI as percentage
    """
    if cost == 0:
        return 0.0
    return ((revenue - cost) / cost) * 100

# Convert to tool
roi_tool = Tool.from_function(calculate_roi)
```

**Key:** Include docstring with Args and Returns for LLM understanding.

---

## With Agent

```python
agent = LlmAgent(
    name="business_analyst",
    model="gemini-3-flash",
    instruction="Analyze business metrics.",
    tools=[roi_tool, revenue_tool, cost_tool]
)
```

---

## Database Tool

```python
import sqlite3

def query_customers(status: str) -> list:
    """Get customers by status.

    Args:
        status: Customer status (active, inactive, pending)

    Returns:
        List of customer records
    """
    conn = sqlite3.connect("customers.db")
    cursor = conn.execute(
        "SELECT * FROM customers WHERE status = ?", (status,)
    )
    return cursor.fetchall()

customer_tool = Tool.from_function(query_customers)
```

---

## API Integration Tool

```python
import requests

def get_weather(city: str) -> dict:
    """Get current weather for a city.

    Args:
        city: City name

    Returns:
        Weather data including temperature and conditions
    """
    response = requests.get(
        f"https://api.weather.com/current?city={city}",
        headers={"Authorization": f"Bearer {API_KEY}"}
    )
    return response.json()

weather_tool = Tool.from_function(get_weather)
```

---

## Human-in-the-Loop

```python
agent = LlmAgent(
    name="careful_agent",
    tools=[sensitive_tool],
    tool_confirmation=True  # Requires approval
)

# Agent pauses for each tool execution
response = agent.run("Process customer refund")
# Prompt: "Approve process_refund? (y/n)"
```

---

## Best Practices

| Practice | Application |
|----------|-------------|
| **Docstrings** | Always include for LLM understanding |
| **Type hints** | Use Python type hints |
| **Error handling** | Return meaningful error messages |
| **Validation** | Validate inputs before processing |
| **Confirmation** | Use for sensitive operations |

---

? PikaKit v3.9.206
