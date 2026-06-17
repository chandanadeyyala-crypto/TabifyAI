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
          setSongs(data.songs);
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetchSongs();
  }, []);

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
          {songs.map((song, index) => (
            <div key={index} className="song-card">
              <h3>{song.fileName}</h3>
              <p>{song.createdAt}</p>

              <pre className="tabs-display">
                {song.tabs}
              </pre>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default History;