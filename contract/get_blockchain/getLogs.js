const { ethers } = require("hardhat");

async function main(id) {
    // Conéctate al contrato
    const [owner] = await ethers.getSigners();
    const contractAddress = "0x062C4B86dcA6Ed53457cf75F4699651B64CD6478"; // Reemplaza con la dirección del contrato desplegado

    const indexedIdProductABI = [
        "event indexed_id_product_event(int256 indexed id, string data)",
        "function indexed_id_product_function(int256 id, string memory data) public"
    ];

    const contract = new ethers.Contract(contractAddress, indexedIdProductABI, owner);

    // Establece un filtro para obtener solo los eventos ese id
    const filter = contract.filters.indexed_id_product_event(id);

    // Obtén los eventos
    const events = await contract.queryFilter(filter);

    // Inicializa un array para almacenar los datos
    const eventData = [];

    // Procesa cada evento
    events.forEach((event) => {
        // Desglosar el string 'data' en sus componentes
        const dataParts = event.args.data.split(',');

        if (dataParts.length === 5) {
            const eventObj = {
                latitude: parseFloat(dataParts[0]),
                longitude: parseFloat(dataParts[1]),
                altitude: parseFloat(dataParts[2]),
                speed: parseFloat(dataParts[3]),
                satellites: parseInt(dataParts[4])
            };

            eventData.push(eventObj);
        }
    });

    // Imprime el JSON con los datos procesados
    console.log(JSON.stringify(eventData, null, 2));
}

main(3)
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
