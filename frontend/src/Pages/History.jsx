import React, { useEffect, useState } from "react";

function History({ setScreen }) {
  const [songs, setSongs] = useState([]);

  useEffect(() => {
    const fetchSongs = async () => {
      const userEmail = localStorage.getItem("user");

      if (!userEmail) return;

      try {
        const res = await fetch(
          `http://127.0.0.1:8000/my-songs?email=${encodeURIComponent(userEmail)}`
        );

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

  const deleteSong = async (songId) => {
    if (!songId) {
      alert("Song id missing. Refresh My Songs page.");
      return;
    }

    const confirmDelete = window.confirm("Delete this song?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`http://127.0.0.1:8000/delete-song/${songId}`, {
        method: "DELETE",
      });

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
        <div className="songs-list">
          {songs.map((song) => (
            <div key={song.id} className="song-card">
              <h3>{song.fileName}</h3>
              <p>{song.createdAt}</p>

              <pre className="tabs-display">{song.tabs}</pre>

              
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default History;