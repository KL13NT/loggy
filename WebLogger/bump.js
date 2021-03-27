const fs = require("fs");
const package = require("./package.json");
const manifest = require("./manifest.json");

manifest.version = package.version;

fs.writeFileSync("manifest.json", JSON.stringify(manifest, null, "\t"));
