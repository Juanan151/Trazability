const { ethers } = require("hardhat");

async function main(id) {
    const [owner] = await ethers.getSigners();
    const contractAddress = "0x062C4B86dcA6Ed53457cf75F4699651B64CD6478"; 

    const indexedIdProductABI = [
        "event indexed_id_product_event(int256 indexed id, string data)",
        "function indexed_id_product_function(int256 id, string memory data) public"
    ];

    const contract = new ethers.Contract(contractAddress, indexedIdProductABI, owner);

    const filter = contract.filters.indexed_id_product_event(id);

    const events = await contract.queryFilter(filter);

    const eventData = [];

    events.forEach((event) => {
        const dataParts = event.args.data.split(',');

        if (dataParts.length === 6) {
            const eventObj = {
                timestamp: String(dataParts[0]),
                temperatura: parseFloat(dataParts[1]),
                humedad: parseFloat(dataParts[2]),
                latitud: parseFloat(dataParts[3]),
                longitud: parseFloat(dataParts[4]),
                movimiento: parseInt(dataParts[5], 10)
            };

            eventData.push(eventObj);
        }
    });

    console.log(JSON.stringify(eventData, null, 2));
}

main(3)
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
