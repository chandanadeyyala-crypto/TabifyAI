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
    <div className="results-card">
      <h2>Generated Guitar Tabs</h2>

      <p>
        File: {audioFile?.name}
      </p>

      <pre classname="tabs-display">
        {tabs}
      </pre>

      <button onClick={downloadPDF}className="download-button">
        Download PDF
      </button>

      <button className="upload-another-btn"
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