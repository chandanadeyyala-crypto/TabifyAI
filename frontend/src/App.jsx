import Navbar from "./components/Navbar";
import Upload from "./components/Upload";
import Loading from "./components/Loading";
import Results from "./Pages/Results";
import { useState } from "react";
import "./App.css";

function App() {
  const [screen, setScreen] = useState("upload");
  const [tabs, setTabs] = useState("");
  const [audioFile, setAudioFile] = useState(null);
console.log("Current screen:", screen);
  return (
    <div className= "card">
      <Navbar title="TabifyAI" className="navbar" />

      {screen === "upload" && (
        <Upload
          setScreen={setScreen}
          setAudioFile={setAudioFile}
        />
      )}

      {screen === "loading" && (
        <Loading
          setScreen={setScreen}
          setTabs={setTabs}
          audioFile={audioFile}
        />
      )}

      {screen === "results" && (
        <Results
          setScreen={setScreen}
          tabs={tabs}
          audioFile={audioFile}
          setAudioFile={setAudioFile}
        />
      )}
    </div>
  );
}

export default App;