// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Certificate {

    address public admin;

    constructor() {
        admin = msg.sender;
    }

    struct Cert {
        string certId;
        string studentName;
        string course;
        string issuer;
        string ipfsHash;
        uint256 issuedAt;
        bool isValid;
    }

    mapping(string => Cert) private certificates;

    event CertificateIssued(string indexed certId, string studentName, string issuer, uint256 timestamp);
    event CertificateRevoked(string indexed certId, uint256 timestamp);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Not authorized");
        _;
    }

    function issueCertificate(
        string memory _certId,
        string memory _studentName,
        string memory _course,
        string memory _issuer,
        string memory _ipfsHash
    ) public onlyAdmin {
        require(!certificates[_certId].isValid, "Already exists");

        certificates[_certId] = Cert(
            _certId,
            _studentName,
            _course,
            _issuer,
            _ipfsHash,
            block.timestamp,
            true
        );

        emit CertificateIssued(_certId, _studentName, _issuer, block.timestamp);
    }

    function verifyCertificate(string memory _certId)
        public
        view
        returns (Cert memory)
    {
        require(certificates[_certId].issuedAt != 0, "Not found");
        return certificates[_certId];
    }

    function revokeCertificate(string memory _certId) public onlyAdmin {
        require(certificates[_certId].isValid, "Already revoked");
        certificates[_certId].isValid = false;
        
        emit CertificateRevoked(_certId, block.timestamp);
    }
}