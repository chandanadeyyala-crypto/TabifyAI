import React, { useState, useEffect } from "react";

function Loading({ setScreen, setTabs, audioFile }) {
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("Starting...");

  const renderBar = (progress) => {
    const totalBlocks = 10;
    const filledBlocks = Math.round((progress / 100) * totalBlocks);

    return (
      "█".repeat(filledBlocks) +
      "░".repeat(totalBlocks - filledBlocks)
    );
  };

  useEffect(() => {
    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        if (prev < 20) {
          setMessage("Uploading audio...");
          return prev + 5;
        }

        if (prev < 80) {
          setMessage("Running Demucs AI separation...");
          return prev + 2;
        }

        return prev;
      });
    }, 1000);

    const uploadToBackend = async () => {
      try {
        const formData = new FormData();
        formData.append("file", audioFile);

        setProgress(10);
        setMessage("Uploading audio...");

        const uploadRes = await fetch("http://127.0.0.1:8000/upload", {
          method: "POST",
          body: formData,
        });

        const uploadData = await uploadRes.json();

        setProgress(80);
        setMessage("Extracting guitar stem...");

        const tabRes = await fetch(
          `http://127.0.0.1:8000/generate-tabs?file_path=${encodeURIComponent(
            uploadData.guitar_file
          )}`,
          {
            method: "POST",
          }
        );

        setProgress(90);
        setMessage("Generating guitar tabs...");

        const tabData = await tabRes.json();

        setTabs(tabData.tabs || "");
        setProgress(100);
        setMessage("Done!");

        setTimeout(() => {
          setScreen("results");
        }, 1000);
      } catch (err) {
        console.log(err);
        alert("Something went wrong");
        setScreen("upload");
      }
    };

    uploadToBackend();

    return () => {
      clearInterval(progressTimer);
    };
  }, []);

  return (
    <div className="loading">
      <h1>Analyzing your audio...</h1>

  <div
  className="progress-circle"
  style={{
    background: `conic-gradient(
      #da34ff ${progress * 3.6}deg,
      rgba(255,255,255,0.12) ${progress * 3.6}deg
    )`
  }}
>
  <div className="progress-inner">
    {progress}%
  </div>
</div>
      <h3 className="loading-message">{message}</h3>
    </div>
  );
}

export default Loading;