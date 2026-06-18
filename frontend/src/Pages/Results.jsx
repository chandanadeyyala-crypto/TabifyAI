import React from "react";
import { jsPDF } from "jspdf";
import toast from "react-hot-toast";

function Results({setScreen, tabs, setAudioFile, audioFile}) {
  const saveSong = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    toast.error("Please login to save songs");
    return;
  }

  try {
    const res = await fetch("http://https://tabifyai.onrender.com/save-song", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        fileName: audioFile?.name || "Untitled Song",
        tabs: tabs,
      }),
    });

    const data = await res.json();

    if (data.status === "success") {
      toast.success("Song saved to My Songs!");
    } else {
      toast.error(data.message || "Failed to save song");
    }
  } catch (err) {
    console.log(err);
    toast.error("Failed to save song");
  }
};

const downloadPDF = (song) => {
  const doc = new jsPDF();

  doc.setTextColor(93, 1, 174);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);
  doc.text("TABIFYAI", 105, 20, { align: "center" });

  doc.setDrawColor(93, 1, 174);
  doc.line(20, 30, 190, 30);

  doc.setTextColor(0, 0, 0);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text("Song:", 20, 45);

  doc.setFont("helvetica", "normal");
  doc.text(audioFile?.name || "Untitled Song", 40, 45);

  doc.setDrawColor(93, 1, 174);
  doc.line(20, 55, 190, 55);

  doc.setTextColor(93, 1, 174);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("GUITAR TABS", 20, 70);

  doc.setTextColor(0, 0, 0);
  doc.setFont("courier", "normal");
  doc.setFontSize(9);

  const pageHeight = doc.internal.pageSize.getHeight();
  const marginLeft = 20;
  const lineHeight = 5;
  const blockGap = 6;
  const tabLines = tabs.split("\n").filter((line) => line.trim() !== "");
  const stringsPerBlock = 6;
  const charsPerLine = 70;

  let y = 85;

  for (let i = 0; i < tabLines.length; i += stringsPerBlock) {
    const group = tabLines.slice(i, i + stringsPerBlock);
    const maxLength = Math.max(...group.map((line) => line.length));

    for (let start = 0; start < maxLength; start += charsPerLine) {
      if (y + stringsPerBlock * lineHeight > pageHeight - 20) {
        doc.addPage();

        doc.setDrawColor(93, 1, 174);
        doc.line(20, 20, 190, 20);

        doc.setTextColor(0, 0, 0);
        doc.setFont("courier", "normal");
        doc.setFontSize(9);

        y = 35;
      }

      group.forEach((line) => {
        const part = line.substring(start, start + charsPerLine);
        doc.text(part, marginLeft, y);
        y += lineHeight;
      });

      y += blockGap;
    }
  }

  doc.save(`${audioFile?.name || "TabifyAI"}-tabs.pdf`);
};

  return (
    <div className="results-card">
      <h2>Generated Guitar Tabs</h2>
      <p>File: {audioFile?.name}</p>
      <pre className="tabs-display">{tabs}</pre>

      <button onClick={downloadPDF} className="download-button">
        Download PDF
      </button>

      <button className="upload-another-btn" onClick={() => { setAudioFile(null); setScreen("upload");}}>
        Upload Another File
      </button>

      <button className="download-button" onClick={saveSong}>
        Save
      </button>
    </div>
  );

}
export default Results;