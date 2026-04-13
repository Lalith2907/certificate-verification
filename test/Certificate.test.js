const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Certificate Contract", function () {
  let Certificate, certificate, owner, addr1;

  beforeEach(async function () {
    [owner, addr1] = await ethers.getSigners();
    Certificate = await ethers.getContractFactory("Certificate");
    certificate = await Certificate.deploy();
    await certificate.waitForDeployment();
  });

  it("Should set the right admin", async function () {
    expect(await certificate.admin()).to.equal(owner.address);
  });

  it("Should issue and verify a valid certificate", async function () {
    const certId = "hash-123";
    const studentName = "John Doe";
    const course = "B.Tech Blockhain";
    const issuer = "PES University";

    await expect(certificate.issueCertificate(certId, studentName, course, issuer))
      .to.emit(certificate, "CertificateIssued")
      .withArgs(certId, studentName, issuer, await ethers.provider.getBlock("latest").then(b => b.timestamp + 1));

    const certData = await certificate.verifyCertificate(certId);
    expect(certData.studentName).to.equal(studentName);
    expect(certData.course).to.equal(course);
    expect(certData.isValid).to.be.true;
  });

  it("Should revoke a certificate", async function () {
    const certId = "hash-revoked";
    await certificate.issueCertificate(certId, "Jane Doe", "B.Tech", "PES");

    await expect(certificate.revokeCertificate(certId))
      .to.emit(certificate, "CertificateRevoked")
      .withArgs(certId, await ethers.provider.getBlock("latest").then(b => b.timestamp + 1));

    const certData = await certificate.verifyCertificate(certId);
    expect(certData.isValid).to.be.false;
  });

  it("Non-admin should not issue certificates", async function () {
    await expect(
      certificate.connect(addr1).issueCertificate("hash-456", "Alice", "B.Tech", "PES")
    ).to.be.revertedWith("Not authorized");
  });
});
