import fs from "fs";
import path from "path";
import { parse } from "csv-parse/sync";

export function getTimezonesFromCSV() {
  const filePath = path.join(process.cwd(), "utils/timezone_list.csv");
  const fileContent = fs.readFileSync(filePath, "utf-8");
  const records = parse(fileContent, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  });

  return records.map(row => ({
    id: row.TimeZone,
    label: `${row.TimeZone} (${row["UTC offset"]}) - ${row.name}`,
  }));
}
