import React, { useState } from 'react';

function App() {
  const [activeTab, setActiveTab] = useState('audio');
  const [summary, setSummary] = useState('');
  const [file, setFile] = useState(null);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert("Please select an audio file first!");
      return;
    }

    const formData = new FormData();
    formData.append('audio', file);

    try {
      setLoading(true);
      const response = await fetch('http://127.0.0.1:5000/transcribe-summarize', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server error: ${errorText}`);
      }

      const data = await response.json();
      console.log("✅ Audio Response:", data);
      setSummary(data.summary || "No summary returned.");
    } catch (error) {
      console.error('❌ Error:', error);
      setSummary("An error occurred while processing the audio.");
    } finally {
      setLoading(false);
    }
  };

  const handleTextSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) {
      alert("Please enter some text!");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('http://127.0.0.1:5000/summarize-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server error: ${errorText}`);
      }

      const data = await response.json();
      console.log("✅ Text Response:", data);
      setSummary(data.summary || "No summary returned.");
    } catch (error) {
      console.error('❌ Error:', error);
      setSummary("An error occurred while summarizing the text.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem', background: '#222', color: 'white', minHeight: '100vh' }}>
      <h1>🧠 Smart Notes AI</h1>

      <div style={{ marginBottom: '1rem' }}>
        <button onClick={() => setActiveTab('audio')} disabled={activeTab === 'audio'} style={{ marginRight: '1rem' }}>
          🎙️ Audio Summarizer
        </button>
        <button onClick={() => setActiveTab('text')} disabled={activeTab === 'text'}>
          📝 Text Summarizer
        </button>
      </div>

      {activeTab === 'audio' && (
        <form onSubmit={handleFileSubmit}>
          <input type="file" accept="audio/*" onChange={(e) => setFile(e.target.files[0])} />
          <button type="submit" disabled={loading} style={{ marginLeft: '10px' }}>
            {loading ? 'Processing...' : 'Submit Audio'}
          </button>
        </form>
      )}

      {activeTab === 'text' && (
        <form onSubmit={handleTextSubmit}>
          <textarea
            rows={6}
            cols={60}
            placeholder="Enter text to summarize..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            style={{ marginBottom: '1rem', width: '100%' }}
          />
          <br />
          <button type="submit" disabled={loading}>
            {loading ? 'Processing...' : 'Submit Text'}
          </button>
        </form>
      )}

      {summary && (
        <div style={{ marginTop: '2rem' }}>
          <h3>📋 Summary:</h3>
          <p>{summary}</p>
        </div>
      )}
    </div>
  );
}

export default App;
