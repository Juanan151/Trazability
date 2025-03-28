const { ethers } = require("hardhat");

async function main() {
  // Obtener la primera cuenta configurada en Hardhat
  const [account] = await ethers.getSigners();
  console.log("Cuenta:", account.address);

  // Obtener el balance en wei de la cuenta
  const balanceWei = await ethers.provider.getBalance(account.address);

  // Convertir el balance de wei a Ether usando ethers.formatEther
  const balanceEther = ethers.formatEther(balanceWei);
  console.log(`Balance: ${balanceEther} ETH`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error:", error);
    process.exit(1);
  });
