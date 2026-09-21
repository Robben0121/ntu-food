// 读取 Excel 清单，打印成 JSON 方便查看
const XLSX = require("xlsx");
const fs = require("fs");

const file = process.argv[2] || "NTU附近美食清单.xlsx";
const buf = fs.readFileSync(file);
const wb = XLSX.read(buf, { type: "buffer" });

console.log("工作簿包含的 sheet：", wb.SheetNames);

for (const name of wb.SheetNames) {
  console.log(`\n===== Sheet: ${name} =====`);
  const ws = wb.Sheets[name];
  const rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: "" });
  // 过滤掉整行都是空的行
  const filtered = rows.filter((r) => r.some((c) => String(c).trim() !== ""));
  console.log(JSON.stringify(filtered, null, 2));
}
