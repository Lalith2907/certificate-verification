import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Issue from "./pages/Issue";
import Verify from "./pages/Verify";
import Revoke from "./pages/Revoke";

function App() {
  return (
    <BrowserRouter>
      {/* Simple Navigation Bar */}
      <nav style={{ background: "#ffffff", padding: "15px 30px", borderBottom: "2px solid #0056b3", display: "flex", gap: "20px" }}>
        <Link to="/" style={{ textDecoration: "none", color: "#333", fontWeight: "bold" }}>Issue Certificate</Link>
        <Link to="/verify" style={{ textDecoration: "none", color: "#333", fontWeight: "bold" }}>Verify Certificate</Link>
        <Link to="/revoke" style={{ textDecoration: "none", color: "#dc3545", fontWeight: "bold", marginLeft: "auto" }}>Admin Revoke</Link>
      </nav>

      <div className="container">
        <Routes>
          <Route path="/" element={<Issue />} />
          <Route path="/verify" element={<Verify />} />
          <Route path="/revoke" element={<Revoke />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
