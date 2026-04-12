import { useState } from "react";
import { getContract } from "../utils/contract";

export default function Revoke() {
  const [certId, setCertId] = useState("");
  const [status, setStatus] = useState("");

  const handleRevoke = async () => {
    if (!certId) return setStatus("Please enter a Certificate Hash.");

    try {
      setStatus(`Attempting to revoke Hash: ${certId}`);
      const contract = await getContract();
      
      const tx = await contract.revokeCertificate(certId);
      
      setStatus("Transaction submitted. Waiting for confirmation...");
      await tx.wait();
      setStatus("Successfully Revoked! Certificate is no longer valid.");
      alert("Certificate Successfully Revoked by Admin");
    } catch (err) {
      if (err.message && err.message.includes("Not authorized")) {
        setStatus("Error: Only the Admin (Deployer) can revoke certificates.");
      } else if (err.message && err.message.includes("Already revoked")) {
         setStatus("Error: Certificate has already been revoked!");
      } else {
        setStatus(`Error: ${err.message || "Failed to revoke"}`);
      }
    }
  };

  return (
    <div className="card">
      <h2 style={{ color: "#dc3545" }}>Admin Revocation</h2>
      <p style={{ color: "#6c757d", fontSize: "14px" }}>Warning: Revoking a certificate is permanent and cannot be undone.</p>

      {status && <p className="status-text" style={{ color: status.includes("Error") ? "#dc3545" : "#28a745" }}>{status}</p>}

      <input
        type="text"
        value={certId}
        onChange={(e) => setCertId(e.target.value)}
        placeholder="Enter Complete Certificate Hash"
      />
      
      <button 
        onClick={handleRevoke} 
        style={{ 
          width: '100%', 
          marginTop: '20px', 
          backgroundColor: '#dc3545' 
        }}
      >
        Permanently Revoke Certificate
      </button>
    </div>
  );
}
