import React from "react";

function Results({
  setScreen,
  tabs,
  setAudioFile,
  audioFile
}) {

  return (
    <div>

      <h2>Here are your results</h2>

      <pre
        style={{
          fontFamily: "monospace",
          whiteSpace: "pre"
        }}
      >
        {tabs}
      </pre>

      <p>
        File: {audioFile?.name}
      </p>

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