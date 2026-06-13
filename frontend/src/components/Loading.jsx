import React, { useState, useEffect } from "react";

function Loading({ setScreen, setTabs, audioFile }) {

  const [progress, setProgress] = useState(0);

  const renderBar = (progress) => {
    const totalBlocks = 10;
    const filledBlocks = Math.round(
      (progress / 100) * totalBlocks
    );
console.log("Loading component rendered");
    return (
      "█".repeat(filledBlocks) +
      "░".repeat(totalBlocks - filledBlocks)
    );
  };

  useEffect(() => {

    const uploadToBackend = async () => {

      try {

        const formData = new FormData();
        formData.append("file", audioFile);

        const uploadRes = await fetch(
          "http://127.0.0.1:8000/upload",
          {
            method: "POST",
            body: formData,
          }
        );

        const uploadData = await uploadRes.json();

        console.log("Upload:", uploadData);

        const tabRes = await fetch(
          `http://127.0.0.1:8000/generate-tabs?file_path=${encodeURIComponent(
            uploadData.guitar_file
          )}`,
          {
            method: "POST",
          }
        );

        const tabData = await tabRes.json();

        console.log("Tabs:", tabData);

        setTabs(tabData.tabs || []);

        setScreen("results");

      } catch (err) {

        console.log(err);
        alert("Something went wrong");
        setScreen("upload");

      }
    };

    uploadToBackend();

    const progressTimer = setInterval(() => {
      setProgress((prev) =>
        Math.min(prev + 5, 95)
      );
    }, 1000);

    return () => clearInterval(progressTimer);

  }, []);

  return (
    <div>
      <h1>Analyzing your audio...</h1>
      <p>{renderBar(progress)} {progress}%</p>
    </div>
  );
}

export default Loading;