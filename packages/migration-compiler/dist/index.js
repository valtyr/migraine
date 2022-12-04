#!/usr/bin/env node

const path = require("path");

require("ts-node").register({
  transpileOnly: true,
  swc: true,
  cwd: path.normalize(__dirname, ".."),
});

const data = require("../src/index");

data.default.main();
