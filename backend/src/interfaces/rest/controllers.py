from flask import Blueprint, request, jsonify
from src.application.services.prompt_service import PromptService

api_blueprint = Blueprint('api', __name__)
prompt_service = PromptService()

@api_blueprint.route('/prompt1', methods=['POST'])
def handle_prompt1():
    data = request.json
    content = data.get('content')
    if not content:
        return jsonify({'error': 'No content provided'}), 400
    
    result = prompt_service.process_prompt_1(content)
    return jsonify({'response': result.response})

@api_blueprint.route('/prompt2', methods=['POST'])
def handle_prompt2():
    data = request.json
    content = data.get('content')
    if not content:
        return jsonify({'error': 'No content provided'}), 400
    
    result = prompt_service.process_prompt_2(content)
    return jsonify({'response': result.response})

@api_blueprint.route('/prompt3', methods=['POST'])
def handle_prompt3():
    data = request.json
    content = data.get('content')
    if not content:
        return jsonify({'error': 'No content provided'}), 400
    
    result = prompt_service.process_prompt_3(content)
    return jsonify({'response': result.response}) 