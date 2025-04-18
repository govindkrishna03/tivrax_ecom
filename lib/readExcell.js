import * as XLSX from "xlsx";
import path from "path";
import fs from "fs";

export function getProductData() {
  const filePath = path.join(process.cwd(), "public", "Product_details.xlsx");
  const fileBuffer = fs.readFileSync(filePath);
  const workbook = XLSX.read(fileBuffer, { type: "buffer" });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const jsonData = XLSX.utils.sheet_to_json(sheet);

  return jsonData; }
