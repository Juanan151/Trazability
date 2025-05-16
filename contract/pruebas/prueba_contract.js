const { ethers } = require("hardhat");


async function main() {

  const [wallet] = await ethers.getSigners();
  console.log("Cuenta usada:", wallet.address);

  const id = 0;
  const data = "PRUEBA DE FUNCIONAMIENTO";

  const contractAddress =
    "0x062C4B86dcA6Ed53457cf75F4699651B64CD6478";

  const contract = await ethers.getContractAt(
    "indexed_id_product",
    contractAddress,
    wallet
  );

  console.log(contract);
  
  console.log(`Enviando TX para producto ${id} con datos: ${data}`);
  try {
    const tx = await contract.indexed_id_product_function(id, data,  {
        gasLimit: 5000000,
        gasPrice: ethers.parseUnits("1", "gwei"),
        nonce: await wallet.getNonce(),
        chainId: 1982,
      });
    console.log("Enviada TX. Hash:", tx.hash);

  } catch (error) {
    console.error("Error en TX:", error);
  }
    
}

main()
  .then(() => console.log("Script en ejecucion..."))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
