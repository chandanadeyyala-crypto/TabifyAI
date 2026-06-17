import React, { useState, useEffect, useRef } from "react";

function Loading({ setScreen, setTabs, audioFile }) {
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("Starting...");
  const intervalRef = useRef(null);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/progress");
        const data = await res.json();

        const backendProgress = Number(data.progress);

        if (!isNaN(backendProgress)) {
          setProgress(backendProgress);
        }

       if (data.message && data.message !== "Idle") {
          setMessage(data.message);
        }
      } catch (err) {
        console.log("Progress fetch error:", err);
      }
    };

    const startProgressPolling = () => {
      fetchProgress();

      intervalRef.current = setInterval(() => {
        fetchProgress();
      }, 500);
    };

    const stopProgressPolling = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };

    const uploadAndGenerateTabs = async () => {
      try {
        console.log("Audio file in Loading:", audioFile);
        setMessage("Uploading audio...");
        startProgressPolling();

        const formData = new FormData();
        formData.append("file", audioFile);

        const uploadRes = await fetch("http://127.0.0.1:8000/upload", {
          method: "POST",
          body: formData,
        });

        const uploadData = await uploadRes.json();

        await fetchProgress();

        const tabRes = await fetch(
          `http://127.0.0.1:8000/generate-tabs?file_path=${encodeURIComponent(
            uploadData.guitar_file
          )}`,
          {
            method: "POST",
          }
        );

        const tabData = await tabRes.json();

        await fetchProgress();

        setTabs(tabData.tabs || "");
        const userEmail = localStorage.getItem("user");

const token = localStorage.getItem("token");
console.log("Token while saving:", token);

if (token && tabData.tabs) {
  await fetch("http://127.0.0.1:8000/save-song", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      fileName: audioFile.name,
      tabs: tabData.tabs,
    }),
  });
}
        setProgress(100);
        setMessage("Done!");

        stopProgressPolling();

        setTimeout(() => {
          setScreen("results");
        }, 1000);
      } catch (err) {
        console.log(err);
        alert("Something went wrong");
        stopProgressPolling();
        setScreen("upload");
      }
    };

    uploadAndGenerateTabs();

    return () => {
      stopProgressPolling();
    };
  }, [audioFile, setScreen, setTabs]);

  const safeProgress = Math.min(100, Math.max(0, Number(progress)));

  return (
    <div className="loading">
      <h1>Analyzing your audio...</h1>

      <div
        className="progress-circle"
        style={{
          background: `conic-gradient(
            #da34ff ${safeProgress * 3.6}deg,
            rgba(255,255,255,0.12) ${safeProgress * 3.6}deg
          )`,
        }}
      >
        <div className="progress-inner">{Math.round(safeProgress)}%</div>
      </div>

      <h3 className="loading-message">{message}</h3>
    </div>
  );
}

export default Loading;