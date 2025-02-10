/* eslint-disable no-undef */
var exec = require("child_process").exec;
var os = require("os");

if (os.type() === "Linux" || os.type() === "Darwin") {
  exec("yarn build-linux-darwin");
  console.info("** .env generado con exito. **");
} else if (os.type() === "Windows_NT") {
  exec("yarn build-windows");
  console.log("** .env generado con exito. **");
} else {
  throw new Error("Unsupported OS found: " + os.type());
}
