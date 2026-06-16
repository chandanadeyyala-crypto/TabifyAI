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

  doc.setFont("courier", "normal");
  doc.setFontSize(9);

  doc.text("TabifyAI Generated Guitar Tabs", 10, 15);

  if (audioFile?.name) {
    doc.text(`File: ${audioFile.name}`, 10, 23);
  }

  const pageHeight = doc.internal.pageSize.getHeight();

  const marginLeft = 10;
  const lineHeight = 5;
  const blockGap = 6;

  let y = 35;

  const tabLines = tabs.split("\n").filter(line => line.trim() !== "");

  const stringsPerBlock = 6;
  const charsPerLine = 70;

  for (let i = 0; i < tabLines.length; i += stringsPerBlock) {
    const group = tabLines.slice(i, i + stringsPerBlock);

    const maxLength = Math.max(...group.map(line => line.length));

    for (let start = 0; start < maxLength; start += charsPerLine) {
      if (y + stringsPerBlock * lineHeight > pageHeight - 15) {
        doc.addPage();
        y = 15;
      }

      group.forEach((line) => {
        const part = line.substring(start, start + charsPerLine);
        doc.text(part, marginLeft, y);
        y += lineHeight;
      });

      y += blockGap;
    }
  }

  doc.save("TabifyAI-Tabs.pdf");
};

  return (
    <div className="results-card">
      <h2>Generated Guitar Tabs</h2>

      <p>
        File: {audioFile?.name}
      </p>

      <pre className="tabs-display">
        {tabs}
      </pre>

      <button onClick={downloadPDF} className="download-button">
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