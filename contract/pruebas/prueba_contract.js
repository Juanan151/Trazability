const { ethers } = require("hardhat");
// Función para enviar la transacción al contrato
async function main() {
  // Obtener la cuenta configurada en Hardhat
  const [wallet] = await ethers.getSigners();
  console.log("Cuenta usada:", wallet.address);

  const id = 0;
  const data = "PRUEBA DE FUNCIONAMIENTO";

  // Dirección del contrato indexed_id_product
  const contractAddress =
    "0x062C4B86dcA6Ed53457cf75F4699651B64CD6478";

  // Obtener la instancia del contrato utilizando el nombre del contrato compilado
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
    console.log("Enviada ✅");
  } catch (error) {
    console.error("Error en TX:", error);
  }
    
}

main()
  .then(() => console.log("Script en ejecución..."))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
