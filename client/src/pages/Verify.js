import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { getContract, getProviderContract } from "../utils/contract";
import { calculateFileHash } from "../utils/hash";

export default function Verify() {
  const [certId, setCertId] = useState("");
  const [data, setData] = useState(null);
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");
  const [searchParams] = useSearchParams();

  // If a QR code is scanned, it might pass the hash via the URL (e.g. ?hash=123)
  useEffect(() => {
    const urlHash = searchParams.get("hash");
    if (urlHash) {
      setCertId(urlHash);
    }
  }, [searchParams]);

  const handleVerify = async () => {
    let finalCertId = certId;
    if (file) {
      setStatus("Calculating hash from file...");
      finalCertId = await calculateFileHash(file);
      setCertId(finalCertId);
    }

    if (!finalCertId) {
      return setStatus("Please provide a Certificate ID or upload a file.");
    }

    setStatus(`Verifying Hash: ${finalCertId}`);
    try {
      // Use getProviderContract for purely reading data from the blockchain
      // This allows iPhones and devices without MetaMask to successfully verify the contract
      const contractUrlParams = searchParams.get("hash") ? true : false;
      const contract = contractUrlParams || !window.ethereum ? getProviderContract() : await getContract();
      
      const result = await contract.verifyCertificate(finalCertId);
      setData(result);
      setStatus("Verification Complete!");
    } catch (err) {
      setData(null);
      if (err.message && err.message.includes("Not found")) {
        setStatus("Certificate not found on the blockchain! (Invalid/Forged)");
      } else {
        setStatus(`Error: ${err.message || "Failed to verify"}`);
      }
    }
  };

  return (
    <div className="card">
      <h2>Verify Certificate</h2>
      {status && <p className="status-text">Status: {status}</p>}

      <input
        type="text"
        value={certId}
        onChange={(e) => setCertId(e.target.value)}
        placeholder="Enter Certificate Hash"
      />
      
      <div className="divider">OR UPLOAD FILE TO VERIFY</div>
      
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />        

      <button onClick={handleVerify} style={{ width: '100%', marginTop: '20px' }}>Verify Certificate</button>

      {data && (
        <div style={{ marginTop: '30px', padding: '20px', border: '1px solid #ced4da', borderRadius: '4px', backgroundColor: '#f8f9fa' }}>
          <h3 style={{ marginTop: 0, borderBottom: '1px solid #dee2e6', paddingBottom: '10px' }}>Verification Result</h3>
          <p><strong>Name:</strong> {data.studentName}</p>
          <p><strong>Course:</strong> {data.course}</p>
          <p><strong>Issuer:</strong> {data.issuer}</p>
          <p><strong>IPFS:</strong> {data.ipfsHash ? data.ipfsHash : "N/A"}</p> 
          <p style={{ fontSize: '18px' }}>
            <strong>Authenticity:</strong> 
            {data.isValid ? 
              <span style={{ color: "#28a745", fontWeight: "bold", marginLeft: "10px" }}>VALID</span> : 
              <span style={{ color: "#dc3545", fontWeight: "bold", marginLeft: "10px" }}>REVOKED</span>
            }
          </p>        
        </div>
      )}
    </div>
  );
}
