import React, { useEffect, useState } from "react";
import { jsPDF } from "jspdf";

function History({ setScreen }) {
  const [songs, setSongs] = useState([]);

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://127.0.0.1:8000/my-songs", {
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

  doc.setFont("courier");
  doc.setFontSize(12);

  doc.text("TabifyAI Generated Guitar Tabs", 10, 15);
  doc.text(`File: ${song.fileName}`, 10, 25);

  const lines = song.tabs.split("\n");

  doc.text(lines, 10, 40);

  doc.save(`${song.fileName}-tabs.pdf`);
};

const deleteSong = async (songId) => {
  const confirmDelete = window.confirm("Delete this song?");

  if (!confirmDelete) return;

  const token = localStorage.getItem("token");

  try {
    const res = await fetch(
      `http://127.0.0.1:8000/delete-song/${songId}`,
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
    } else {
      alert(data.message);
    }
  } catch (err) {
    console.log(err);
    alert("Failed to delete song");
  }
};
  return (
    <div className="results-card">
      <h2>My Songs</h2>

      {songs.length === 0 ? (
        <div className="empty-history">
          <p>You haven't uploaded any songs yet.</p>
          <button
            className="upload-button"
            onClick={() => setScreen("upload")}
          >
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
            <pre className="tabs-display">
              {song.tabs}
            </pre>
          </div>
        ))
      )}
    </div>
  );
}

export default History;
