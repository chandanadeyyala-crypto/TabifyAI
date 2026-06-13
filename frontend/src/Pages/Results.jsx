import React from "react";

function Results({
  setScreen,
  tabs,
  setAudioFile,
  audioFile
}) {

  const downloadTabs = () => {
    const blob = new Blob([tabs], {
      type: "text/plain"
    });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "tabifyai-tabs.txt";
    a.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div>

      <h2>Generated Guitar Tabs</h2>

      <p>
        File: {audioFile?.name}
      </p>

      <pre
        style={{
          fontFamily: "monospace",
          whiteSpace: "pre-wrap",
          background: "#111",
          color: "#0f0",
          padding: "20px",
          borderRadius: "8px"
        }}
      >
        {tabs}
      </pre>

      <button onClick={downloadTabs}>
        Download Tabs
      </button>

      <button
        onClick={() => {
          setAudioFile(null);
          setScreen("upload");
        }}
      >
        Upload Another File
      </button>

    </div>
  );
}

export default Results;