import {Database} from "better-sqlite3";

type SQLWriterData = {
  allRows: string[][];
  blockSize: number;
  tableName: string;
  columns: string[];
};

type SQLWriter = {
  data: SQLWriterData;
  appendRow: (values: string[]) => void;
  writeAllRows: (values?: string[]) => void;
};

export const multipleRowsWriter = (
  db: Database,
  tableName: string,
  columns: string[],
  blockSize = 10000
): SQLWriter => {
  const data: SQLWriterData = {
    allRows: [],
    tableName,
    columns,
    blockSize,
  };

  const appendRow = (values: string[]) => {
    data.allRows.push(values);
  };

  const writeAllRows = () => {
    let counter = 0;
    let values = "";
    const rounds = Math.ceil(data.allRows.length / data.blockSize);
    let block = 0;
    console.log("writing all rows:", data.allRows.length);
    console.log("blocksize:", data.blockSize);
    console.log("rounds:", rounds);

    let row = data.allRows.shift();

    const writeBlock = () => {
      const sql = `INSERT INTO ${data.tableName} (${columns.join(
        ", "
      )}) VALUES ${values};`;
      try {
        db.prepare(sql).run();
        block++;
        console.log(`${block} done.`);
      } catch (error) {
        console.log("Error with statement:", sql);
        throw error;
      }
    };

    while (row) {
      counter++;
      if (counter % data.blockSize === 0) {
        values += `('${row.join("', '")}')`;
        writeBlock();
        values = "";
      } else {
        values += `('${row.join("', '")}'), `;
      }
      row = data.allRows.shift();
    }
    // Write leftover rows from last block
    values = values.slice(0, -2);
    writeBlock();
    values = "";
  };

  // Return Writer
  return {
    data,
    appendRow,
    writeAllRows,
  };
};
