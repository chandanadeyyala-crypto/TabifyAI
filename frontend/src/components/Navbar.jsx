import { useState } from "react";

function Navbar({ title, setScreen, screen, isLoggedIn, setIsLoggedIn }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");

  setIsLoggedIn(false);
  setScreen("upload");
};

  const goTo = (page) => {
    setScreen(page);
    setMenuOpen(false);
  };

  return (
    <div className="navbar">
      <div className="name" onClick={() => goTo("upload")}>
        <h1>{title}</h1>
        <p>Convert your audio recordings into guitar tabs</p>
      </div>

        <button className="menu-btn" onClick={() => setMenuOpen(!menuOpen)}>
          ☰
          </button>


    <div className={`nav-buttons ${menuOpen ? "show" : ""}`}>
      {!isLoggedIn ? (
        <>
        {screen !== "upload" && (
        <button className="nav-btn" onClick={() => goTo("upload")}>
          Go Back
        </button>
      )}

      {screen !== "login" && (
        <button className="nav-btn" onClick={() => goTo("login")}>
          Login
        </button>
      )}

      {screen !== "signup" && (
        <button className="nav-btn" onClick={() => goTo("signup")}>
          Signup
        </button>
      )}
    </>
  ) : (
    <>
      {screen !== "upload" && (
        <button className="nav-btn" onClick={() => goTo("upload")}>
          Go Back
        </button>
      )}

      {screen === "upload" && (
        <button className="nav-btn" onClick={() => goTo("history")}>
          My Songs
        </button>
      )}

      <button className="nav-btn" onClick={logout}>
        Logout
      </button>
    </>
  )}
</div>
</div>
  );
}

export default Navbar;