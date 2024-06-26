import * as fs from "fs";

/**
 * Clear dir of all files.
 */
const clearDir = (path: string) => {
  fs.rmSync(path + "/", {recursive: true});
};

/**
 * Create directory
 */

const makeDir = (path: string) => {
  fs.mkdirSync(path, {recursive: true});
};

/**
 * Safely clear a directory
 */
export const flushDirSync = (path: string) => {
  path = path.slice(-1) === "/" ? path.slice(0, -1) : path;
  fs.existsSync(`${path}`) && clearDir(path);
  makeDir(path);
  fs.writeFileSync(`${path}/_flushed.txt`, Date());
};

/**
 * Pass error forward.
 */
export const simpleErrorBubbler = (error: Error) => {
  if (error) throw error;
};

/**
 * Catch and console log error.
 */
export const simpleErrorCatcher = (error: Error) => {
  error && console.log("Error:" + error);
};

/**
 * Throw error if condition met.
 */
export const throwIf = (condition: boolean, message: string) => {
  if (condition) {
    throw Error(message);
  }
};
