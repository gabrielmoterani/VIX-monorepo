from dataclasses import dataclass
from typing import Dict, Any

@dataclass
class Prompt:
    prompt_type: str
    content: str
    response: str = None 