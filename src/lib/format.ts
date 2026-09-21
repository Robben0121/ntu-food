// 金额格式化：整数不带小数，非整数保留两位（如 $3.30）
export function money(n: number): string {
  return n % 1 === 0 ? `$${n}` : `$${n.toFixed(2)}`;
}

// 价格区间展示（SGD 新币）
export function priceLabel(min: number | null, max: number | null): string {
  if (min != null && max != null) return `${money(min)}–${money(max)}`;
  if (min != null) return `${money(min)} 起`;
  if (max != null) return `${money(max)} 以内`;
  return "价格未知";
}

// 标签拆分：支持顿号「、」和逗号「,」「，」
export function splitTags(tags: string): string[] {
  return tags
    .split(/[、,，]/)
    .map((t) => t.trim())
    .filter(Boolean);
}

export function formatDate(d: Date): string {
  return d.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
