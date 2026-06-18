import React, { useEffect, useState } from "react";
import { jsPDF } from "jspdf";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
function History({ setScreen }) {
  const [songs, setSongs] = useState([]);

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("${import.meta.env.VITE_API_URL}/my-songs", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (data.status === "success") {
          console.log("Fetched songs:", data.songs);
          setSongs(data.songs);
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchSongs();
  }, []);

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
  doc.text(song.fileName || "Untitled Song", 40, 45);

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
  const tabLines = song.tabs.split("\n").filter((line) => line.trim() !== "");
  const stringsPerBlock = 6;
  const charsPerLine = 70;

  let y = 85;

  for (let i = 0; i < tabLines.length; i += stringsPerBlock) {
    const group = tabLines.slice(i, i + stringsPerBlock);
    const maxLength = Math.max(...group.map((line) => line.length));

    for (let start = 0; start < maxLength; start += charsPerLine) {
      if (y + stringsPerBlock * lineHeight > pageHeight - 20) {
        doc.addPage();
        y = 20;
      }

      group.forEach((line) => {
        const part = line.substring(start, start + charsPerLine);
        doc.text(part, marginLeft, y);
        y += lineHeight;
      });

      y += blockGap;
    }
  }

  doc.save(`${song.fileName || "TabifyAI"}-tabs.pdf`);
};
const deleteSong = async (songId) => {
  const result = await Swal.fire({
    title: "Delete Song?",
    text: "This action cannot be undone.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Delete",
    cancelButtonText: "Cancel",
  });

  if (!result.isConfirmed) return;

  const token = localStorage.getItem("token");

  try {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/delete-song/${songId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await res.json();

    if (data.status === "success") {
      setSongs((prevSongs) =>
        prevSongs.filter((song) => song.id !== songId)
      );

      Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: "Song deleted successfully.",
        timer: 1500,
        showConfirmButton: false,
      });
    }
  } catch (err) {
    console.log(err);

    Swal.fire({
      icon: "error",
      title: "Oops!",
      text: "Failed to delete song.",
    });
  }
};

  return (
    <div className="results-card">
      <h2>My Songs</h2>

      {songs.length === 0 ? (
        <div className="empty-history">
          <p>You haven't uploaded any songs yet.</p>
          <button className="upload-button" onClick={() => setScreen("upload")}>
            Upload a Song
          </button>
        </div>
      ) : (
        songs.map((song) => (
          <div className="song-card" key={song.id || song._id}>
            <h3>{song.fileName}</h3>
            <p>{new Date(song.createdAt).toLocaleDateString()}</p>
            <button className="download-button" onClick={() => downloadPDF(song)}>
              Download PDF
              </button>

              <button className="download-button" onClick={() => deleteSong(song.id)}>
                Delete Song
                </button>

            <pre className="tabs-display">{song.tabs}</pre>

          </div>
        ))
      )}
    </div>
  );
}
export default History;
