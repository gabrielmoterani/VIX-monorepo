import openai
from config import Config

class OpenAIRepository:
    def __init__(self):
        # Set API key for older version of OpenAI package
        openai.api_key = Config.OPENAI_API_KEY

    def process_prompt(self, prompt: str, model: str = "gpt-3.5-turbo") -> str:
        try:
            response = openai.ChatCompletion.create(
                model=model,
                messages=[
                    {"role": "user", "content": prompt}
                ]
            )
            return response.choices[0].message.content
        except Exception as e:
            print(f"Error calling OpenAI API: {e}")
            return f"Error processing prompt: {str(e)}" 