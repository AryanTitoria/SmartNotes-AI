import whisper

# Load the Whisper model
model = whisper.load_model("base")

# Transcribe audio file (make sure this file is in the same folder)
result = model.transcribe("audio.mp3")

# Print the transcription
print("Transcription:\n", result["text"])
