import React from "react";
import { jsPDF } from "jspdf";

function Results({
  setScreen,
  tabs,
  setAudioFile,
  audioFile
}) {
  const downloadPDF = () => {
    const doc = new jsPDF();

    doc.setFont("courier");
    doc.setFontSize(12);

    doc.text("TabifyAI Generated Guitar Tabs", 10, 15);

    if (audioFile?.name) {
      doc.text(`File: ${audioFile.name}`, 10, 25);
    }

    const lines = tabs.split("\n");

    doc.text(lines, 10, 40);

    doc.save("TabifyAI-Tabs.pdf");
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

      <button onClick={downloadPDF}>
        Download PDF
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