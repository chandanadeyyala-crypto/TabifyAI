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
    const progressTimer = setInterval(async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/progress");
        const data = await res.json();

        setProgress(data.progress);
        setMessage(data.message);
      } catch (err) {
        console.log("Progress error:", err);
      }
    }, 1000);

    const uploadToBackend = async () => {
      try {
        const formData = new FormData();
        formData.append("file", audioFile);

        const uploadRes = await fetch("http://127.0.0.1:8000/upload", {
          method: "POST",
          body: formData,
        });

        const uploadData = await uploadRes.json();

        const tabRes = await fetch(
          `http://127.0.0.1:8000/generate-tabs?file_path=${encodeURIComponent(
            uploadData.guitar_file
          )}`,
          {
            method: "POST",
          }
        );

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
    <div>
      <h1>Analyzing your audio...</h1>

      <p>{renderBar(progress)} {progress}%</p>

      <h3>{message}</h3>
    </div>
  );
}

export default Loading;