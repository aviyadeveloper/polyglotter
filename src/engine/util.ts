import * as fs from "fs";

const clearDir = (path: string) => {
  fs.rmSync(path + "/", {recursive: true});
};

const makeDir = (path: string) => {
  fs.mkdirSync(path, {recursive: true});
};

export const flushDirSync = (path: string) => {
  path = path.slice(-1) === "/" ? path.slice(0, -1) : path;
  fs.existsSync(`${path}`) && clearDir(path);
  makeDir(path);
  fs.writeFileSync(`${path}/_flushed.txt`, Date());
};

export const simpleErrorBubbler = (error: Error) => {
  if (error) throw error;
};

export const simpleErrorCatcher = (error: Error) => {
  error && console.log("Error:" + error);
};

export const throwIf = (condition: boolean, message: string) => {
  if (condition) {
    throw Error(message);
  }
};
