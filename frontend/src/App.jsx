import Navbar from "./components/Navbar";
import Upload from "./components/Upload";
import Loading from "./components/Loading";
import Results from "./Pages/Results";
import Signup from "./Pages/Signup";
import Login from "./Pages/Login";
import History from "./Pages/History";
import toast from "react-hot-toast";
import { useState } from "react";
import "./App.css";

function App() {
  const [screen, setScreen] = useState("upload");
  const [tabs, setTabs] = useState("");
  const [audioFile, setAudioFile] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(
  !!localStorage.getItem("token")
);
console.log("Current screen:", screen);
  return (
    <div className= "card">
      <Navbar title="TabifyAI" setScreen={setScreen} screen={screen} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />

      {screen === "upload" && (
        <Upload setScreen={setScreen} setAudioFile={setAudioFile}/>
      )}

      {screen === "loading" && (
        <Loading setScreen={setScreen} setTabs={setTabs} audioFile={audioFile}/>
      )}

      {screen === "results" && (
        <Results setScreen={setScreen} tabs={tabs} audioFile={audioFile} setAudioFile={setAudioFile}/>
      )}

      {screen === "signup" && (
        <Signup setScreen={setScreen} />
     )}

      {screen === "login" && (
        <Login
           setScreen={setScreen} setIsLoggedIn={setIsLoggedIn} />
      )}

      {screen === "history" && (
        <History setScreen={setScreen} />
      )}

      <footer className="footer"> © 2026 TabifyAI</footer>
    </div>

  );
}

export default App;