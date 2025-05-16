const { ethers } = require("hardhat");

async function main() {
  const [sender] = await ethers.getSigners();
  console.log("Cuenta remitente:", sender.address);
  console.log("Cuenta destinataria: 0xbadfe4969619ed7f72bfb6fc3b4488b947ec2844");

  const tx = await sender.sendTransaction({
    to: '0xbadfe4969619ed7f72bfb6fc3b4488b947ec2844',
    value: ethers.parseEther("1.0"),
    gasLimit: 21000,
    gasPrice: ethers.parseUnits("1", "gwei"),
    nonce: await sender.getNonce(),
    chainId: 1982,
  });

  console.log("Transaccion enviada. Hash:", tx.hash);
  const receipt = await tx.wait(1);
  console.log("Confirmada en bloque:", receipt.blockNumber);
}

main().catch((error) => {
  console.error("Error:", error);
  process.exit(1);
});
