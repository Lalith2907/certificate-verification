import { useState } from "react";
import { getContract } from "../utils/contract";
import { calculateFileHash } from "../utils/hash";
import { QRCodeCanvas } from "qrcode.react";

export default function Issue() {
  const [form, setForm] = useState({
    certId: "",
    studentName: "",
    course: "",
    issuer: "",
    ipfsHash: "",
  });
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");
  const [issuedCertId, setIssuedCertId] = useState("");

  const handleSubmit = async () => {
    let finalCertId = form.certId;
    if (file) {
      setStatus("Generating Hash...");
      finalCertId = await calculateFileHash(file);
      setForm({ ...form, certId: finalCertId });
    }

    if (!finalCertId || !form.studentName || !form.course || !form.issuer) {
      return setStatus("Error: All fields are required.");
    }

    try {
      setStatus(`Submitting Hash: ${finalCertId}`);
      const contract = await getContract();

      const tx = await contract.issueCertificate(
        finalCertId,
        form.studentName,
        form.course,
        form.issuer
      );

      setStatus("Waiting for confirmation...");
      await tx.wait();
      setStatus("Certificate Issued Successfully");
      setIssuedCertId(finalCertId); // Save the true hash to trigger QR generation
      alert("Certificate Issued Successfully!");
    } catch (err) {
      if (err.message && err.message.includes("Already exists")) {
        setStatus("Error: Certificate already exists on the blockchain.");
      } else if (err.code === "ACTION_REJECTED" || (err.message && err.message.includes("user rejected action"))) {
        setStatus("Error: Transaction cancelled by the user in MetaMask.");
      } else {
        setStatus(`Error: ${err.message || "Tx Failed"}`);
      }
      setIssuedCertId("");
    }
  };

  const downloadQRCode = () => {
    const canvas = document.getElementById("qr-code-canvas");
    const pngUrl = canvas
      .toDataURL("image/png")
      .replace("image/png", "image/octet-stream");
    let downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = `certificate_qr.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  return (
    <div className="card">
      <h2>Issue Certificate</h2>
      {status && <p className="status-text">Status: {status}</p>}

      <input
        type="text"
        placeholder="Certificate ID (Or upload file to automatically generate)"
        value={form.certId}
        onChange={(e) => setForm({ ...form, certId: e.target.value })}
      />
      
      <div className="divider">OR UPLOAD FILE TO GENERATE ID</div>
      
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />        

      <input
        type="text"
        placeholder="Student Name"
        value={form.studentName}
        onChange={(e) => setForm({ ...form, studentName: e.target.value })}     
      />
      <input
        type="text"
        placeholder="Course"
        value={form.course}
        onChange={(e) => setForm({ ...form, course: e.target.value })}
      />
      <input
        type="text"
        placeholder="Issuer"
        value={form.issuer}
        onChange={(e) => setForm({ ...form, issuer: e.target.value })}
      />

      <button onClick={handleSubmit} style={{ width: '100%', marginTop: '20px' }}>Issue Certificate</button>

      {issuedCertId && (
        <div style={{ marginTop: "30px", borderTop: "1px solid #eee", paddingTop: "20px", textAlign: "center" }}>
          <h3>Verification QR Code</h3>
          <QRCodeCanvas
            id="qr-code-canvas"
            value={`http://192.168.0.202:3000/verify?hash=${issuedCertId}`}     
            size={200}
            level={"H"}
            includeMargin={true}
          />
          <p style={{ marginTop: '10px', fontSize: '14px', color: '#6c757d' }}>Scan to verify certificate authenticity.</p>
          <button onClick={downloadQRCode} style={{ backgroundColor: '#28a745', marginTop: '10px', padding: '10px 20px', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
            Download QR Code
          </button>
        </div>
      )}
    </div>
  );
}
