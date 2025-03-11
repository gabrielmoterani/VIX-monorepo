from src.domain.models.prompt import Prompt
from src.infrastructure.repositories.openai_repository import OpenAIRepository

class PromptService:
    def __init__(self):
        self.openai_repo = OpenAIRepository()

    def process_prompt_1(self, content: str) -> Prompt:
        prompt = Prompt(prompt_type="type1", content=content)
        prompt.response = self.openai_repo.process_prompt(content)
        return prompt

    def process_prompt_2(self, content: str) -> Prompt:
        prompt = Prompt(prompt_type="type2", content=content)
        prompt.response = self.openai_repo.process_prompt(content)
        return prompt

    def process_prompt_3(self, content: str) -> Prompt:
        prompt = Prompt(prompt_type="type3", content=content)
        prompt.response = self.openai_repo.process_prompt(content)
        return prompt 