const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Desplegando contrato con:", deployer.address);

  const ContractFactory = await ethers.getContractFactory("indexed_id_product");

  const contract = await ContractFactory.deploy({
    gasLimit: 5000000,
    gasPrice: ethers.parseUnits("1", "gwei"),
    nonce: await deployer.getNonce(),
    chainId: 1982,
  });

  console.log("Esperando confirmacion...");
  const receipt = await contract.deploymentTransaction().wait(1);

  console.log("Contrato desplegado correctamente:");
  console.log("Direccion:", contract.target);
  console.log("Tx Hash:", receipt.hash);
  console.log("Gas usado:", receipt.gasUsed.toString());
  console.log("Bloque:", receipt.blockNumber);
  console.log("Remitente:", receipt.from);
}

main().catch((err) => {
  console.error("Error al desplegar:", err);
  process.exit(1);
});
