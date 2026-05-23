"""Resume upload, ATS analysis, and admin resume API routes."""

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Resume, User
import os
from groq import Groq
import PyPDF2
import docx
from utils.ats_score import calculate_ats_score, get_ats_feedback

resume_bp = Blueprint('resume', __name__)
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def extract_text(file):
    filename = file.filename
    if filename.endswith('.pdf'):
        pdf_reader = PyPDF2.PdfReader(file)
        text = ""
        for page in pdf_reader.pages:
            text += page.extract_text()
        return text
    elif filename.endswith('.docx'):
        doc = docx.Document(file)
        text = ""
        for para in doc.paragraphs:
            text += para.text + "\n"
        return text
    return ""

@resume_bp.route('/analyze', methods=['POST'])
@jwt_required()
def analyze_resume():
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400
    
    file = request.files['file']
    company = request.form.get('company', 'General')
    job_role = request.form.get('job_role', 'General')
    
    text = extract_text(file)
    
    if not text:
        return jsonify({"error": "Could not extract text from file"}), 400

    user_id = get_jwt_identity()

    try:
        # Calculate ATS score based on resume content
        ats_score = calculate_ats_score(text)
        
        # Get detailed feedback
        feedback_list = get_ats_feedback(text)
        
        # Enhanced AI analysis for "Real World Scenario"
        prompt = f"""
        You are an expert recruiter and hiring manager at {company}. 
        You are evaluating a candidate for a {job_role} role.
        
        Analyze this resume based on {company}'s typical hiring standards, culture, and job requirements for a {job_role}.
        
        Provide a detailed, realistic "Real World Scenario" analysis:
        1. **Company Fit**: How well does this candidate match {company}'s values and technical bar?
        2. **Technical Alignment**: Does their experience align with the tech stack and challenges at {company}?
        3. **Strengths**: What would stand out to a hiring manager at {company}?
        4. **Critical Gaps**: What's missing that might cause them to be rejected or struggle in the interview?
        5. **Actionable Roadmap**: 3-5 specific, high-impact changes to make this resume a "Top 1%" candidate for {company}.
        6. **ATS Keywords**: Specific keywords they MUST add to pass {company}'s automated filters for {job_role}.
        
        Resume Content:
        {text[:4000]}
        
        Format the response using professional markdown with headers and bullet points. 
        Be honest, direct, and slightly critical—like a real internal feedback loop.
        """

        try:
            completion = client.chat.completions.create(
                model="llama-3.1-8b-instant",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.4,
                max_tokens=1500
            )
            ai_analysis = completion.choices[0].message.content
        except Exception as e:
            ai_analysis = "AI analysis unavailable. Please review the basic feedback below."
        
        # Combine feedback
        feedback_text = "\n".join(feedback_list)
        full_analysis = f"""
### 📊 REAL-WORLD ATS SCORE: {ats_score}/100
*Note: This score is an estimate based on general industry standards.*

{ai_analysis}

---
### 🔍 BASIC SYSTEM FEEDBACK
{feedback_text}
        """

        new_resume = Resume(
            user_id=user_id,
            filename=file.filename,
            ats_score=ats_score,
            analysis=full_analysis
        )
        db.session.add(new_resume)
        db.session.commit()

        return jsonify({
            "analysis": full_analysis,
            "score": ats_score,
            "feedback": feedback_list,
            "company": company,
            "job_role": job_role
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@resume_bp.route('/admin/all', methods=['GET'])
@jwt_required()
def get_all_resumes_admin():
    current_user_id = get_jwt_identity()
    admin = User.query.get(current_user_id)
    
    if admin.role != 'admin':
        return jsonify({"error": "Admin access required"}), 403
    
    resumes = Resume.query.order_by(Resume.created_at.desc()).all()
    resume_list = []
    for r in resumes:
        user = User.query.get(r.user_id)
        resume_list.append({
            "id": r.id,
            "username": user.username if user else "Unknown",
            "filename": r.filename,
            "ats_score": r.ats_score,
            "created_at": r.created_at.isoformat()
        })
    
    return jsonify(resume_list), 200

@resume_bp.route('/admin/<int:resume_id>', methods=['DELETE'])
@jwt_required()
def delete_resume_admin(resume_id):
    current_user_id = get_jwt_identity()
    admin = User.query.get(current_user_id)
    
    if admin.role != 'admin':
        return jsonify({"error": "Admin access required"}), 403
    
    resume = Resume.query.get_or_404(resume_id)
    db.session.delete(resume)
    db.session.commit()
    
    return jsonify({"msg": "Resume deleted successfully"}), 200
