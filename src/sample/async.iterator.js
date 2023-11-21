import assert from "assert";
import { generate } from "csv-generate";
import { parse } from "csv-parse";
import data from "../../db.json";

(async () => {
  const task = data.task;
  const parser = generate({
    high_water_mark: 64 * 64,
    length: 100,
  }).pipe(parse());

  process.stdout.write("start\n");
  for await (const task of parser) {
    process.stdout.write(` ${task}\n`);
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  process.stdout.write("...done\n");
  assert.strictEqual(count, 100);
})();
