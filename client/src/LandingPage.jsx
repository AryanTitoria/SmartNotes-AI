import React from "react";
import "./LandingPage.css";

const LandingPage = () => {
  return (
    <div>
      {/* Navigation Bar */}
      <nav>
        <div className="container">
          <div className="nav-content">
            <div className="logo">Smart Notes AI</div>
            <div className="nav-buttons">
              <button className="btn btn-secondary" onClick={() => alert("Login coming soon!")}>Login</button>
              <button className="btn btn-primary" onClick={() => alert("Signup coming soon!")}>Get Started</button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <h1>Transform Any Content Into Smart Summaries</h1>
              <p>
                Harness the power of AI to instantly summarize text, audio, and images.
                Save hours of reading and focus on what matters most.
              </p>
              <button className="btn btn-primary">Start Summarizing Free</button>
            </div>
            <div className="hero-visual">
              <div className="floating-card card-1">
                <div style={{ fontSize: "1.5rem" }}>📝</div>
                <div>Text Summary</div>
              </div>
              <div className="floating-card card-2">
                <div style={{ fontSize: "1.5rem" }}>🎵</div>
                <div>Audio Analysis</div>
              </div>
              <div className="floating-card card-3">
                <div style={{ fontSize: "1.5rem" }}>🖼️</div>
                <div>Image Insights</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <h2 className="section-title">Powerful AI Features</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">📝</div>
              <h3>Text Summarization</h3>
              <p>
                Paste or upload any article or document and get an intelligent summary instantly.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🎵</div>
              <h3>Audio Summarization</h3>
              <p>
                Upload lectures or voice recordings, and let our AI transcribe and summarize key points.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🖼️</div>
              <h3>Image OCR + Summary</h3>
              <p>
                Extract handwritten or printed notes and summarize them with OCR + AI.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section className="workflow">
        <div className="container">
          <h2 className="section-title">How It Works</h2>
          <div className="workflow-steps">
            <div className="workflow-step">
              <div className="step-number">1</div>
              <h3>Upload</h3>
              <p>Drag & drop files or paste content to get started.</p>
            </div>
            <div className="workflow-step">
              <div className="step-number">2</div>
              <h3>Process</h3>
              <p>Our AI analyzes and extracts the key content.</p>
            </div>
            <div className="workflow-step">
              <div className="step-number">3</div>
              <h3>Summarize</h3>
              <p>Get short, accurate, and meaningful summaries.</p>
            </div>
            <div className="workflow-step">
              <div className="step-number">4</div>
              <h3>Use</h3>
              <p>Copy, export, or share the smart summaries anywhere.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
