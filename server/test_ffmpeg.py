import subprocess

try:
    subprocess.run(["ffmpeg", "-version"], check=True)
    print("✅ FFmpeg is accessible!")
except Exception as e:
    print("❌ FFmpeg not found:", e)

