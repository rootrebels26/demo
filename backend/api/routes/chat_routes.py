"""Interview chat API routes for AI interaction and session saving."""

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Interview
import os
from groq import Groq
from dotenv import load_dotenv
from services.company_question_profiles import build_interview_prompt
from services.speech_service import prepare_spoken_reply

load_dotenv()

chat_bp = Blueprint('chat', __name__)
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

@chat_bp.route('/interact', methods=['POST'])
@jwt_required()
def interact():
    data = request.get_json()
    messages = data.get('messages', [])
    subject = data.get('subject', 'general')
    company = data.get('company', 'General')
<<<<<<< HEAD
    behavior = data.get('behavior')
=======
>>>>>>> d417c960dd5719642e7328a49bba71d30ef531ff
    
    system_prompt = {
        "role": "system",
        "content": build_interview_prompt(subject, company)
    }
<<<<<<< HEAD

    if behavior:
        behavior_prompt = {
            "role": "system",
            "content": (
                "Use this live non-verbal interview signal as light coaching context. "
                "Mention it only when useful, keep it supportive, and do not claim medical, "
                f"emotion, or identity analysis: {behavior}"
            )
        }
        groq_messages = [system_prompt, behavior_prompt] + messages
    else:
        groq_messages = [system_prompt] + messages
=======
    
    groq_messages = [system_prompt] + messages
>>>>>>> d417c960dd5719642e7328a49bba71d30ef531ff

    try:
        completion = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=groq_messages,
            temperature=0.45,
            max_tokens=220
        )
        
        response_text = completion.choices[0].message.content
        return jsonify({
            "reply": response_text,
            "speech_text": prepare_spoken_reply(response_text),
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@chat_bp.route('/save', methods=['POST'])
@jwt_required()
def save_interview():
    user_id = get_jwt_identity()
    data = request.get_json()
    conversation = data.get('conversation')
    subject = data.get('subject', 'general')
    
    new_interview = Interview(user_id=user_id, conversation=conversation, subject=subject)
    db.session.add(new_interview)
    db.session.commit()
    
    return jsonify({"msg": "Interview saved", "id": new_interview.id}), 201
