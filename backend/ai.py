import os
import requests
from dotenv import load_dotenv

load_dotenv()

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")

MODEL = "openrouter/free"

SYSTEM_PROMPT = """
You are Remo, an intelligent AI study assistant created by Atharva.

Your personality:
- Friendly and supportive.
- Explain concepts clearly.
- Help with coding, studies, projects and daily questions.
- Keep answers concise unless asked for detail.
"""


def get_ai_response(user_message):
    if not OPENROUTER_API_KEY:
        return "Error: OPENROUTER_API_KEY not found."

    url = "https://openrouter.ai/api/v1/chat/completions"

    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:8000",
        "X-Title": "Remo AI"
    }

    data = {
        "model": MODEL,
        "messages": [
            {
                "role": "system",
                "content": SYSTEM_PROMPT
            },
            {
                "role": "user",
                "content": user_message
            }
        ]
    }

    try:
        print("=" * 60)
        print("Using Model:", MODEL)
        print("=" * 60)

        response = requests.post(
            url,
            headers=headers,
            json=data,
            timeout=60
        )

        print("Status Code:", response.status_code)
        print("Response:", response.text)

        if response.status_code != 200:
            return f"OpenRouter Error ({response.status_code}): {response.text}"

        result = response.json()

        return result["choices"][0]["message"]["content"]

    except Exception as e:
        return f"Error: {str(e)}"