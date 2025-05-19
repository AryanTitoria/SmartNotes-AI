from flask import Flask, request, jsonify
from flask_cors import CORS  # Add this import
from transformers import pipeline

app = Flask(__name__)
CORS(app)  # Add this line to enable CORS

summarizer = pipeline("summarization", model="facebook/bart-large-cnn")

@app.route('/summarize', methods=['POST'])
def summarize_text():
    data = request.get_json()
    text = data.get('text', '')

    if not text:
        return jsonify({"error": "No text provided"}), 400

    summary = summarizer(text, max_length=150, min_length=30, do_sample=False)
    return jsonify({"summary": summary[0]['summary_text']})

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5001, debug=True)  # Updated this line