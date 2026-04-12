async function main() {
  const Certificate = await ethers.getContractFactory("Certificate");
  const contract = await Certificate.deploy();

  await contract.waitForDeployment();

  console.log("Deployed to:", await contract.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
