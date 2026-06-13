import React, { useState, useEffect } from "react";

function Loading({ setScreen, setTabs, audioFile }) {
  const loadingSteps = [
    "Uploading audio...",
    "Running Demucs AI separation...",
    "Extracting guitar stem...",
    "Detecting notes...",
    "Generating guitar tabs..."
  ];

  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  const renderBar = (progress) => {
    const totalBlocks = 10;
    const filledBlocks = Math.round((progress / 100) * totalBlocks);

    return (
      "█".repeat(filledBlocks) +
      "░".repeat(totalBlocks - filledBlocks)
    );
  };

  useEffect(() => {
    console.log("Current loading step:", loadingSteps[currentStep]);
    const uploadToBackend = async () => {
      try {
        const formData = new FormData();
        formData.append("file", audioFile);

        const uploadRes = await fetch("http://127.0.0.1:8000/upload", {
          method: "POST",
          body: formData,
        });

        const uploadData = await uploadRes.json();
        console.log("Upload:", uploadData);

        setCurrentStep(2);

        const tabRes = await fetch(
          `http://127.0.0.1:8000/generate-tabs?file_path=${encodeURIComponent(
            uploadData.guitar_file
          )}`,
          {
            method: "POST",
          }
        );

        setCurrentStep(4);

        const tabData = await tabRes.json();
        console.log("Tabs:", tabData);

        setProgress(100);
        setTabs(tabData.tabs || "");
        setScreen("results");

      } catch (err) {
        console.log(err);
        alert("Something went wrong");
        setScreen("upload");
      }
    };

    const progressTimer = setInterval(() => {
      setProgress((prev) => Math.min(prev + 5, 95));
    }, 1000);

    const stepTimer = setInterval(() => {
      setCurrentStep((prev) =>
        Math.min(prev + 1, loadingSteps.length - 1)
      );
    }, 4000);

    uploadToBackend();

    return () => {
      clearInterval(progressTimer);
      clearInterval(stepTimer);
    };
  }, []);

  console.log("Current step number:", currentStep);
console.log("Current step text:", loadingSteps[currentStep]);

return (
  <div>
    <h1>Analyzing your audio...</h1>

    <p>{renderBar(progress)} {progress}%</p>

    <h3>
      {progress < 20 && "Uploading audio..."}
      {progress >= 20 && progress < 50 && "Running Demucs AI separation..."}
      {progress >= 50 && progress < 70 && "Extracting guitar stem..."}
      {progress >= 70 && progress < 90 && "Detecting notes..."}
      {progress >= 90 && "Generating guitar tabs..."}
    </h3>
  </div>
);
}
export default Loading;     