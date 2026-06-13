import React, { useState } from "react";

function Upload({ setScreen, setAudioFile }) {

  const [file, setFile] = useState(null);

  const uploadFile = () => {

    if (!file) {
      alert("Please select an audio file");
      return;
    }

    setAudioFile(file);
console.log("Switching to loading");
    setScreen("loading");
  };

  return (
    <div className="upload-container">

      <h2>Upload your song 🎸</h2>

      <input
        type="file"
        accept="audio/*"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <button onClick={uploadFile}>
        Generate Tabs
      </button>

    </div>
  );
}

export default Upload;