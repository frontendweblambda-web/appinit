import fs from "fs";
import path from "path";

const source = path.resolve("bin/cli.js");
const target = path.resolve("dist/cli.js");

fs.copyFileSync(source, target);
