import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="card" style={{ textAlign: "center", padding: "50px 30px" }}>
      <h1 style={{ color: "#0056b3", marginBottom: "10px" }}>Decentralized Web3 Certificate Verifier</h1>
      
      <p style={{ color: "#6c757d", fontSize: "16px", maxWidth: "600px", margin: "20px auto 40px auto", lineHeight: "1.6" }}>
        Leveraging Ethereum Smart Contracts to ensure tamper-proof validations. Institute administrators can issue cryptographic certificates instantly.
        Employers and automated systems can verify digital documents securely without third-party reliance.
      </p>

      <div style={{ display: "flex", justifyContent: "center", gap: "20px" }}>
        <Link to="/issue" style={{ 
            textDecoration: "none", 
            backgroundColor: "#0056b3", 
            padding: "12px 24px", 
            color: "white", 
            fontWeight: "bold", 
            borderRadius: "4px" 
        }}>
          Launch Issuer Console
        </Link>
        
        <Link to="/verify" style={{ 
            textDecoration: "none", 
            backgroundColor: "#28a745", 
            padding: "12px 24px", 
            color: "white", 
            fontWeight: "bold", 
            borderRadius: "4px" 
        }}>
          Verification Portal
        </Link>
      </div>

      <div style={{ marginTop: "60px", color: "#adb5bd", fontSize: "12px" }}>
        PES University Blockchain Project • 2026
      </div>
    </div>
  );
}
