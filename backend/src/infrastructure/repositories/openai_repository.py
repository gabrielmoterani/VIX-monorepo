import openai
from config import Config
import json
class OpenAIRepository:
    def __init__(self):
        # Set API key for older version of OpenAI package
        openai.api_key = Config.OPENAI_API_KEY

    def process_image(self, prompt: any, model: str = "gpt-4o-mini") -> str:
        try:
            response = openai.ChatCompletion.create(
                model=model,
                messages=[
                    {"role": "system", "content": "You are a system that analyzes web images and generates alt text for them."},
                    {"role": "system", "content": "You will be given the page summary so you can generate the alt text based on the content of the page."},
                    {"role": "user", "content": prompt['summary']},
                    {"role": "system", "content": "You will be given the url of the image, so you can generate the alt text based on the content of the page."},
                    {"role": "user", "content": prompt['imageUrl']},
                    {"role": "system", "content": "Generate a concise, descriptive alt text for this image, WCAG compliant. Focus on the main subject, important details, and context. The alt text should be helpful for visually impaired users."},
                ]
            )
            return response.choices[0].message.content
        except Exception as e:
            print(f"Error calling OpenAI API: {prompt}")
            return f"Error processing prompt: {str(prompt)}"
        
    def process_summary(self, prompt: str, model: str = "gpt-4o") -> str:
        try:
            # For vision models, we need to format the message differently
            response = openai.ChatCompletion.create(
                model=model,
                messages=[
                    {"role": "system", "content": "You are a system that summarizes web pages, you will be given a string with all extracted texts from the page and you will need to summarize it in a few sentences."},
                    {"role": "user", "content": prompt},
                ],
            )
            return response.choices[0].message.content
        except Exception as e:
            print(f"Error calling OpenAI Vision API: {e}")
            return f"Error processing image: {str(e)}"

    def process_wcag_check(self, prompt: str, model: str = "gpt-4o") -> str:
        try:
            # For vision models, we need to format the message differently
            response = openai.ChatCompletion.create(
                model=model,
                messages=[
                    {"role": "system", "content": "You are a system that checks web pages for WCAG and ARIA compliance, you will be given a json represatation of the DOM elements on the page"},
                    {"role": "user", "content": prompt},
                    {"role": "system", "content": "You will need to check the page for WCAG and ARIA compliance. Return a json with the array of elements that are not WCAG compliant and the tags to make them compliant, ignore ALT tags."},
                    {"role": "system", "content": "Return a JSON with the following format: {'elements': [{'id': 'string', 'addAttributes': [{'attributeName': 'string', 'value': 'string'}]}]}. The id is the id of the element, the addAttributes is an array of attributes and values to add to the element to make it compliant."},
                    {"role": "system", "content": "Return a JSON and only the JSON, no other text or comments."}
                ],
            )
            return response.choices[0].message.content
        except Exception as e:
            print(f"Error calling OpenAI Vision API: {e}")
            return f"Error processing image: {str(e)}"
            
    def process_page_task(self, html_content: str, task_prompt: str, page_summary: str, model: str = "gpt-4o-mini") -> str:
        try:
            # Format the prompt for OpenAI
            response = openai.ChatCompletion.create(
                model=model,
                messages=[
                    {"role": "system", "content": "You are an AI assistant that helps users interact with web pages based on their instructions."},
                    {"role": "system", "content": "You will be given an json representation of the actions to be performed on the DOM of a web page, a task prompt, and a summary of the page."},
                    {"role": "user", "content": f"DOM: {json.dumps(html_content)}\n\nTask Prompt: {task_prompt}\n\nPage Summary: {page_summary}"},
                    {"role": "system", "content": "Based on the task prompt, generate JavaScript commands that can be executed to accomplish the task, prefer using querySelector that used the data-vix attribute like this: .querySelector('[data-vix=\"DATA_VIX_ID_HERE\"]'). Return a JSON response with the following structure: {\"explanation\": \"An simple answer to the task prompt, in a friendly way, describe if its possible to do the task or not, if its not possible, explain why\", \"js_commands\": [\"command1\", \"command2\", ...]}. The js_commands should be JavaScript commands that can be executed to fulfill the task, use the data-vix attribute to select the elements."},
                    {"role": "system", "content": "Return a JSON and only the JSON, no other text or comments."}
                ],
            )
            return response.choices[0].message.content
        except Exception as e:
            print(f"Error processing page task: {e}")
            return f"Error processing page task: {str(e)}"