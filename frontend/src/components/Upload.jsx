import React, { useState } from "react";

function Upload({ setScreen, setAudioFile }) {
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFile = (selectedFile) => {
    if (!selectedFile) return;

    setFile(selectedFile);
    setAudioFile(selectedFile);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);

    const droppedFile = e.dataTransfer.files[0];
    handleFile(droppedFile);
  };

  const uploadFile = () => {
    if (!file) {
      alert("Please select an audio file");
      return;
    }

    setScreen("loading");
  };

return (
  <div className="upload-card">
    <h2>Upload your song 🎸</h2>

    <div
      className={`drop-zone ${dragActive ? "active" : ""}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="drop-center">
        <span>{file ? file.name : "Drop your file in this box"}</span>
      </div>

      <div className="file-controls">
        <label className="choose-file-btn">
          Choose File
          <input
            type="file"
            accept="audio/*"
            onChange={(e) => handleFile(e.target.files[0])}
            hidden
          />
        </label>
      </div>
    </div>

    <button onClick={uploadFile} className="upload-button">
      Generate Tabs
    </button>
  </div>
);
}

export default Upload;