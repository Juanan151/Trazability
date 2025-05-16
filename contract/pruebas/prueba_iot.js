const { SerialPort } = require("serialport");
const { ReadlineParser } = require("@serialport/parser-readline");

const port = new SerialPort({
    path: "COM5",
    baudRate: 9600,
  });
const parser = port.pipe(new ReadlineParser({ delimiter: "\n" }));

async function main() {
  parser.on("data", (line) => {
    const data = line.trim();
    console.log(data);
  });
}

main()
  .then()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
