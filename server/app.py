from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import pipeline
import tempfile
import os
import whisper
import pytesseract
from PIL import Image

# Setup
app = Flask(__name__)
CORS(app)

# Load T5 summarizer and Whisper
print("📦 Loading Whisper model...")
whisper_model = whisper.load_model("base")

print("📚 Loading HuggingFace T5 summarization model...")
summarizer = pipeline("summarization", model="t5-base", tokenizer="t5-base")

# TEXT summarization
@app.route('/summarize-text', methods=['POST'])
def summarize_text():
    try:
        data = request.get_json()
        text = data.get('text', '')

        if not text.strip():
            return jsonify({'summary': 'No text provided'}), 400

        print("📥 Text received for summarization.")
        summary_result = summarizer(text, max_length=100, min_length=30, do_sample=False)
        summary = summary_result[0]['summary_text']
        print("✅ Text Summary:", summary)

        return jsonify({'summary': summary})

    except Exception as e:
        print("❌ Text Summarization Error:", str(e))
        return jsonify({'summary': 'An error occurred during text summarization.'}), 500

# AUDIO summarization
@app.route('/transcribe-summarize', methods=['POST'])
def transcribe_and_summarize():
    if 'audio' not in request.files:
        return jsonify({'summary': 'No audio file provided'}), 400

    audio_file = request.files['audio']
    print("📥 Received audio file:", audio_file.filename)

    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=".m4a") as tmp:
            audio_path = tmp.name
            audio_file.save(audio_path)
            print("📁 Saved audio at:", audio_path)

        print("🔊 Transcribing...")
        result = whisper_model.transcribe(audio_path)
        transcription = result["text"]
        print("📝 Transcription:", transcription)

        print("📚 Summarizing...")
        summary_result = summarizer(transcription, max_length=100, min_length=30, do_sample=False)
        summary = summary_result[0]['summary_text']
        print("✅ Summary:", summary)

        return jsonify({'summary': summary, 'transcription': transcription})

    except Exception as e:
        print("❌ Backend Error:", str(e))
        return jsonify({'summary': 'An error occurred while processing the file.'}), 500

    finally:
        try:
            os.remove(audio_path)
        except:
            pass

# IMAGE summarization (OCR)
@app.route('/summarize-image', methods=['POST'])
def summarize_image():
    if 'image' not in request.files:
        return jsonify({'summary': 'No image file provided'}), 400

    image_file = request.files['image']
    print("🖼️ Image received:", image_file.filename)

    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=".png") as tmp:
            image_path = tmp.name
            image_file.save(image_path)
            print("📁 Saved image at:", image_path)

        print("🔎 Performing OCR...")
        text = pytesseract.image_to_string(Image.open(image_path))
        print("📄 Extracted Text:", text)

        print("📚 Summarizing extracted text...")
        summary_result = summarizer(text, max_length=100, min_length=30, do_sample=False)
        summary = summary_result[0]['summary_text']
        print("✅ OCR Summary:", summary)

        return jsonify({'summary': summary, 'extracted_text': text})

    except Exception as e:
        print("❌ OCR Summarization Error:", str(e))
        return jsonify({'summary': 'An error occurred during OCR processing.'}), 500

    finally:
        try:
            os.remove(image_path)
        except:
            pass

@app.route('/')
def home():
    return "Smart Notes AI backend running with T5 + Whisper + OCR!"

if __name__ == '__main__':
    app.run(debug=True)




# gemini code
# from flask import Flask, request, jsonify
# from flask_cors import CORS
# import os
# import whisper
# import requests
# import tempfile
# from dotenv import load_dotenv

# app = Flask(__name__)
# CORS(app)
# load_dotenv()

# # Load API Key and Gemini model name
# API_KEY = os.getenv("GEMINI_API_KEY")
# GEMINI_MODEL = "models/gemini-1.5-pro"
# GEMINI_URL = f"https://generativelanguage.googleapis.com/v1/{GEMINI_MODEL}:generateContent?key={API_KEY}"

# # Load Whisper model
# print("📦 Loading Whisper model...")
# whisper_model = whisper.load_model("base")

# # ------------ Route 1: Audio Transcribe + Summarize ----------------
# @app.route('/transcribe-summarize', methods=['POST'])
# def transcribe_and_summarize():
#     if 'audio' not in request.files:
#         return jsonify({'summary': 'No audio file provided'}), 400

#     audio_file = request.files['audio']
#     print("📥 Received file:", audio_file.filename)

#     try:
#         with tempfile.NamedTemporaryFile(delete=False, suffix='.m4a') as tmp:
#             audio_path = tmp.name
#             audio_file.save(audio_path)
#             print("📁 Saved audio at:", audio_path)

#         print("🔊 Transcribing...")
#         result = whisper_model.transcribe(audio_path)
#         transcription = result["text"]
#         print("📝 Transcription:", transcription)

#         print("📚 Summarizing with Gemini...")
#         response = requests.post(GEMINI_URL, json={
#             "contents": [{
#                 "parts": [{
#                     "text": f"Summarize the following text:\n\n{transcription}"
#                 }]
#             }]
#         })

#         if response.status_code != 200:
#             raise Exception(response.text)

#         summary = response.json()["candidates"][0]["content"]["parts"][0]["text"]
#         print("✅ Summary:", summary)

#         return jsonify({
#             'transcription': transcription,
#             'summary': summary
#         })

#     except Exception as e:
#         print("❌ Backend Error:", e)
#         return jsonify({'summary': 'An error occurred while processing the file.'}), 500

#     finally:
#         try:
#             os.remove(audio_path)
#         except:
#             pass


# # ------------ Route 2: Text Summarization ----------------
# @app.route('/summarize-text', methods=['POST'])
# def summarize_text():
#     try:
#         data = request.get_json()
#         text = data.get('text', '').strip()

#         if not text:
#             return jsonify({'summary': 'No text provided'}), 400

#         print("📥 Text received for summarization.")

#         response = requests.post(GEMINI_URL, json={
#             "contents": [{
#                 "parts": [{
#                     "text": f"Summarize the following text:\n\n{text}"
#                 }]
#             }]
#         })

#         if response.status_code != 200:
#             raise Exception(response.text)

#         summary = response.json()["candidates"][0]["content"]["parts"][0]["text"]
#         print("✅ Text Summary:", summary)

#         return jsonify({'summary': summary})

#     except Exception as e:
#         print("❌ Text Summarization Error:", e)
#         return jsonify({'summary': 'An error occurred during text summarization.'}), 500


# @app.route('/')
# def home():
#     return "✅ SmartNotes AI (Gemini + Whisper) backend running!"


# if __name__ == '__main__':
#     app.run(debug=True)
