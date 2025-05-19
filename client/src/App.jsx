import React, { useState } from "react";
import {
  Container,
  Paper,
  Typography,
  Tabs,
  Tab,
  Box,
  Button,
  TextField
} from "@mui/material";
import AudiotrackIcon from "@mui/icons-material/Audiotrack";
import DescriptionIcon from "@mui/icons-material/Description";
import ImageIcon from "@mui/icons-material/Image";
import "./App.css";

function App() {
  const [tab, setTab] = useState(0);
  const [file, setFile] = useState(null);
  const [textInput, setTextInput] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => setFile(e.target.files[0]);
  const handleTextChange = (e) => setTextInput(e.target.value);
  const handleTabChange = (_, newTab) => setTab(newTab);

  const handleSubmit = async () => {
    setLoading(true);
    setSummary("");

    const endpoint =
      tab === 0
        ? "/transcribe-summarize"
        : tab === 1
        ? "/summarize-text"
        : "/summarize-image";

    const body =
      tab === 1
        ? JSON.stringify({ text: textInput })
        : (() => {
            const formData = new FormData();
            formData.append(tab === 0 ? "audio" : "image", file);
            return formData;
          })();

    try {
      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method: "POST",
        headers: tab === 1 ? { "Content-Type": "application/json" } : undefined,
        body
      });

      const data = await response.json();
      setSummary(data.summary || "No summary returned.");
    } catch (error) {
      console.error("❌ Error:", error);
      setSummary("An error occurred while summarizing.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="background">
      <Container className="main-container">
        <Paper elevation={10} className="form-box">
          <Typography variant="h4" gutterBottom>
            🎓 Smart Notes AI
          </Typography>
          <Tabs
            value={tab}
            onChange={handleTabChange}
            variant="fullWidth"
            sx={{ mb: 2 }}
          >
            <Tab icon={<AudiotrackIcon />} label="Audio" />
            <Tab icon={<DescriptionIcon />} label="Text" />
            <Tab icon={<ImageIcon />} label="Image" />
          </Tabs>

          <Box>
            {tab === 1 ? (
              <TextField
                multiline
                rows={6}
                fullWidth
                variant="outlined"
                label="Enter your text here"
                value={textInput}
                onChange={handleTextChange}
                sx={{ mb: 2 }}
              />
            ) : (
              <input type="file" accept={tab === 0 ? "audio/*" : "image/*"} onChange={handleFileChange} style={{ marginBottom: "1rem" }} />
            )}
            <Button variant="contained" color="primary" onClick={handleSubmit} disabled={loading} fullWidth>
              {loading ? "Processing..." : "Submit"}
            </Button>
          </Box>

          {summary && (
            <Box mt={4}>
              <Typography variant="h6">📄 Summary:</Typography>
              <Typography>{summary}</Typography>
            </Box>
          )}
        </Paper>
      </Container>
    </div>
  );
}

export default App;
