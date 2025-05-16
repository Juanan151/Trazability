const { ethers } = require("hardhat");

async function main() {

  const [account] = await ethers.getSigners();
  console.log("Cuenta:", account.address);

  const balanceWei = await ethers.provider.getBalance(account.address);

  const balanceEther = ethers.formatEther(balanceWei);
  console.log(`Balance: ${balanceEther} ETH`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error:", error);
    process.exit(1);
  });
