import { parse } from "csv-parse";
import fs from "node:fs";

const csvPath = new URL("./tasks.csv", import.meta.url);

const readableStream = fs.ReadStream(csvPath);

const csvParse = parse({
  skipEmptyLines: true,
  delimiter: ",",
  fromLine: 2,
});

(async () => {
  const streamParse = readableStream.pipe(csvParse);

  for await (const lines of streamParse) {
    const [name, description] = lines;

    await fetch("http://localhost:3333/task", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        description,
      }),
    });

    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  process.stdout.write("...done\n");
})();
