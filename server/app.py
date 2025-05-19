from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import whisper
from transformers import pipeline
import tempfile

app = Flask(__name__)
CORS(app)

# Load Whisper model for transcription and BART summarizer
whisper_model = whisper.load_model("base")
summarizer = pipeline("summarization", model="facebook/bart-large-cnn")

@app.route('/transcribe-summarize', methods=['POST'])
def transcribe_and_summarize():
    if 'audio' not in request.files:
        return jsonify({'summary': 'No audio file provided'}), 400

    audio_file = request.files['audio']
    print("📥 Received file:", audio_file.filename)

    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix='.m4a') as tmp:
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

        return jsonify({
            'summary': summary,
            'transcription': transcription
        })

    except Exception as e:
        print("❌ Backend Error:", e)
        return jsonify({'summary': 'An error occurred while processing the file.'}), 500

    finally:
        try:
            os.remove(audio_path)
        except:
            pass

@app.route('/summarize-text', methods=['POST'])
def summarize_text():
    try:
        data = request.get_json()
        text = data.get('text', '')

        if not text.strip():
            return jsonify({'summary': 'No text provided'}), 400

        print("📥 Text received for summarization:", text)

        summary_result = summarizer(text, max_length=100, min_length=30, do_sample=False)
        summary = summary_result[0]['summary_text']
        print("✅ Text Summary:", summary)

        return jsonify({'summary': summary})

    except Exception as e:
        print("❌ Text Summarization Error:", e)
        return jsonify({'summary': 'An error occurred during text summarization.'}), 500

if __name__ == '__main__':
    app.run(debug=True)
