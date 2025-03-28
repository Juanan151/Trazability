const { ethers } = require("hardhat");
const { SerialPort } = require("serialport");
const { ReadlineParser } = require("@serialport/parser-readline");

async function main() {
  // Configurar el puerto serial
  const port = new SerialPort({
    path: "COM5",
    baudRate: 9600,
  });
  const parser = port.pipe(new ReadlineParser({ delimiter: "\n" }));

  // Obtener la cuenta configurada en Hardhat
  const [wallet] = await ethers.getSigners();
  console.log("Cuenta usada:", wallet.address);

  // Dirección del contrato indexed_id_product
  const contractAddress = "0x062C4B86dcA6Ed53457cf75F4699651B64CD6478";

  // Obtener la instancia del contrato utilizando el nombre del contrato compilado
  const contract = await ethers.getContractAt(
    "indexed_id_product",
    contractAddress
  );

  // Estructura de productos
  let products = [
    { id: 1, totalPoints: 16, completedPoints: 0 },
    { id: 2, totalPoints: 15, completedPoints: 0 },
    { id: 3, totalPoints: 20, completedPoints: 0 },
    { id: 4, totalPoints: 13, completedPoints: 0 },
    { id: 5, totalPoints: 14, completedPoints: 0 },
    { id: 6, totalPoints: 15, completedPoints: 0 },
    { id: 7, totalPoints: 18, completedPoints: 0 },
    { id: 8, totalPoints: 13, completedPoints: 0 },
  ];

  let currentProductIndex = 0;

  let nonce_actual = await wallet.getNonce();

  // Función para enviar la transacción al contrato
  async function tx_function(id, data) {
    try {
      const tx = await contract.indexed_id_product_function(id, data, {
        gasLimit: 5000000,
        gasPrice: ethers.parseUnits("1", "gwei"),
        nonce: nonce_actual,
        chainId: 1982,
      });
      nonce_actual = nonce_actual + 1;
      console.log("Enviada ✅");
    } catch (error) {
      console.error("Error en TX:", error);
    }
  }

  // Lógica de trazabilidad
  async function tx_trazabilidad(id, data) {
    const product = products[currentProductIndex];
    console.log(
      `Producto ${id}, punto ${product.completedPoints + 1}: ${data}`
    );

    await tx_function(id, data);
    product.completedPoints++;

    if (product.completedPoints >= product.totalPoints) {
      console.log(`Producto ${id} completado.`);
      if (currentProductIndex < products.length - 1) {
        currentProductIndex++;
      }
    }
  }

  // Escuchar datos del puerto serial
  parser.on("data", (line) => {
    const data = line.trim();
    const currentProduct = products[currentProductIndex];
    if (1) {
      if (currentProductIndex < products.length - 1) {
        tx_trazabilidad(currentProduct.id, data);
      } else {
        console.log("Todos los productos completados.");
      }
    } else {
      console.log("Esperando");
    }
  });
}

main()
  .then()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
