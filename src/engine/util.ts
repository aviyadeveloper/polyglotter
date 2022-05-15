const fs = require("fs");

const clearDir = (path: string) => {
  fs.rmdirSync(path + "/", {recursive: true}, simpleErrorBubbler);
};

const makeDir = (path: string) => {
  fs.mkdirSync(path, {recursive: true}, simpleErrorBubbler);
};

export const flushDirSync = (path: string) => {
  path = path.slice(-1) === "/" ? path.slice(0, -1) : path;
  fs.existsSync(`${path}`) && clearDir(path);
  makeDir(path);
  fs.writeFile(`${path}/_flushed.txt`, Date(), simpleErrorCatcher);
};

export const simpleErrorBubbler = (error: Error) => {
  if (error) throw error;
};

export const simpleErrorCatcher = (error: Error) => {
  error && console.log("Error:" + error);
};
