from flask import Blueprint, request, jsonify
from src.application.services.prompt_service import PromptService

api_blueprint = Blueprint('api', __name__)
prompt_service = PromptService()

@api_blueprint.route('/parse_image', methods=['POST'])
def parse_image():
    data = request.json
    content = data.get('content')
    if not content:
        return jsonify({'error': 'No content provided'}), 400
    result = prompt_service.parse_image(content)
    return jsonify({'response': result.response})

@api_blueprint.route('/wcag_check', methods=['POST'])
def wcag_check():
    data = request.json
    content = data.get('content')
    if not content:
        return jsonify({'error': 'No content provided',}), 400
    result = prompt_service.wcag_check(content)
    return jsonify({'response': result.response})

@api_blueprint.route('/summarize_page', methods=['POST'])
def summarize_page():
    data = request.json
    content = data.get('content')
    if not content:
        return jsonify({'error': 'No content provided', 'content': content}), 400
    
    result = prompt_service.summarize_page(content)
    return jsonify({'response': result.response}) 