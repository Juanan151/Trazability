const { ethers } = require("hardhat");
const { SerialPort } = require("serialport");
const { ReadlineParser } = require("@serialport/parser-readline");

async function main() {
  const port = new SerialPort({
    path: "COM5",
    baudRate: 9600,
  });
  const parser = port.pipe(new ReadlineParser({ delimiter: "\n" }));

  const [wallet] = await ethers.getSigners();
  console.log("Cuenta usada:", wallet.address);

  const contractAddress = "0x062C4B86dcA6Ed53457cf75F4699651B64CD6478";

  const contract = await ethers.getContractAt(
    "indexed_id_product",
    contractAddress
  );

  let products = [
    { id: 8, totalPoints: 16, completedPoints: 0 },
    { id: 9, totalPoints: 15, completedPoints: 0 },
    { id: 10, totalPoints: 20, completedPoints: 0 },
    { id: 11, totalPoints: 13, completedPoints: 0 },
  ];

  let currentProductIndex = 0;

  let nonce_actual = await wallet.getNonce();

  async function tx_function(id, data) {
    try {
      const tx = await contract.indexed_id_product_function(id, data, {
        gasLimit: 5000000,
        gasPrice: ethers.parseUnits("1", "gwei"),
        nonce: nonce_actual,
        chainId: 1982,
      });
      nonce_actual = nonce_actual + 1;
      console.log("Enviada TX:", tx.hash);
    } catch (error) {
      console.error("Error en TX:", error);
    }
  }

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

  parser.on("data", (line) => {
    const rawData = line.trim();
    const timestamp = Date.now();
    const data = `${timestamp}${rawData}`;

    const currentProduct = products[currentProductIndex];
      if (currentProductIndex < products.length - 1) {
        tx_trazabilidad(currentProduct.id, data);
      } else {
        console.log("Todos los productos completados.");
      }
  });
}

main()
  .then()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
