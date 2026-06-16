import React, { useState, useEffect } from "react";

function Loading({ setScreen, setTabs, audioFile }) {
  const [progress, setProgress] = useState(5);
  const [message, setMessage] = useState("Preparing upload...");

  useEffect(() => {
    let slowProgressTimer;

    const startSlowProgress = () => {
      slowProgressTimer = setInterval(() => {
        setProgress((prev) => {
          if (prev < 25) {
            setMessage("Uploading audio...");
            return prev + 1;
          }

          if (prev < 65) {
            setMessage("Running Demucs AI separation...");
            return prev + 0.5;
          }

          if (prev < 78) {
            setMessage("Extracting guitar stem...");
            return prev + 0.2;
          }

          return prev;
        });
      }, 1000);
    };

    const uploadToBackend = async () => {
      try {
        startSlowProgress();

        const formData = new FormData();
        formData.append("file", audioFile);

        const uploadRes = await fetch("http://127.0.0.1:8000/upload", {
          method: "POST",
          body: formData,
        });

        const uploadData = await uploadRes.json();

        setProgress(80);
        setMessage("Generating guitar tabs...");

        const tabRes = await fetch(
          `http://127.0.0.1:8000/generate-tabs?file_path=${encodeURIComponent(
            uploadData.guitar_file
          )}`,
          {
            method: "POST",
          }
        );

        const tabData = await tabRes.json();

        setProgress(95);
        setMessage("Finalizing tabs...");

        setTabs(tabData.tabs || "");

        setTimeout(() => {
          setProgress(100);
          setMessage("Done!");

          setTimeout(() => {
            setScreen("results");
          }, 800);
        }, 500);
      } catch (err) {
        console.log(err);
        alert("Something went wrong");
        setScreen("upload");
      }
    };

    uploadToBackend();

    return () => {
      clearInterval(slowProgressTimer);
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
          )`,
        }}
      >
        <div className="progress-inner">{Math.round(progress)}%</div>
      </div>

      <h3 className="loading-message">{message}</h3>
    </div>
  );
}

export default Loading;