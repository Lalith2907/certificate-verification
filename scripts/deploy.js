async function main() {
  const Certificate = await ethers.getContractFactory("Certificate");
  const contract = await Certificate.deploy();

  await contract.waitForDeployment();

  console.log("Deployed to:", await contract.getAddress());
  
  // Add this line to prevent the Windows Node.js libuv assertion error when exiting
  process.exit(0);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
