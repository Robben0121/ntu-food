// 从 Excel 清单导入餐厅数据到数据库
// 用法：npm run seed   （默认读取 NTU附近美食清单.xlsx）
//       node scripts/import-xlsx.cjs 其他文件.xlsx
// 按「店名」去重：已存在的会更新，不存在的会新增（保留已有评分和评论）
require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const XLSX = require("xlsx");
const fs = require("fs");

const prisma = new PrismaClient();
const file = process.argv[2] || "NTU附近美食清单.xlsx";

function str(v) {
  return v == null ? "" : String(v).trim();
}

// 解析 "S$5-10" / "S$3.30" / "S$2.20-3" 为人均价格区间
function parsePrice(s) {
  if (!s) return { min: null, max: null };
  const cleaned = str(s).replace(/[S$]/g, "");
  const parts = cleaned
    .split(/[-–]/)
    .map((x) => x.trim())
    .filter(Boolean);
  const toNum = (x) => {
    const n = parseFloat(x);
    return Number.isFinite(n) ? n : null;
  };
  if (parts.length === 0) return { min: null, max: null };
  if (parts.length === 1) return { min: toNum(parts[0]), max: null };
  return { min: toNum(parts[0]), max: toNum(parts[1]) };
}

async function main() {
  const buf = fs.readFileSync(file);
  const wb = XLSX.read(buf, { type: "buffer" });
  const ws = wb.Sheets[wb.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: "" });

  // 跳过表头（第一行），过滤空行
  const dataRows = rows.slice(1).filter((r) => str(r[0]));

  let created = 0;
  let updated = 0;
  const skipped = [];

  for (const row of dataRows) {
    const name = str(row[0]);
    if (!name) continue;

    const price = parsePrice(str(row[3]));
    const record = {
      name,
      cuisine: str(row[1]) || "其他",
      address: str(row[2]),
      priceMin: price.min,
      priceMax: price.max,
      description: str(row[4]) || null,
      tags: str(row[5]),
      hours: str(row[6]) || null,
      sourceUrl: str(row[7]) || null,
    };

    if (!record.address) {
      skipped.push(name);
      continue;
    }

    const existing = await prisma.restaurant.findFirst({ where: { name } });
    if (existing) {
      await prisma.restaurant.update({
        where: { id: existing.id },
        data: record,
      });
      updated++;
    } else {
      await prisma.restaurant.create({ data: record });
      created++;
    }
  }

  const total = await prisma.restaurant.count();
  console.log(`导入完成：新增 ${created} 家，更新 ${updated} 家，当前共 ${total} 家餐厅`);
  if (skipped.length) {
    console.log(`跳过（缺位置）：${skipped.join("、")}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
