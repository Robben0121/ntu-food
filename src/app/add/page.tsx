import { addRestaurant } from "@/app/actions";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

const inputCls =
  "w-full rounded-lg border border-stone-200 px-3 py-2 text-sm focus:border-orange-400 focus:outline-none";

const cuisines = [
  "中餐",
  "西餐",
  "日料",
  "韩餐",
  "泰餐",
  "越南菜",
  "印度菜",
  "马来餐",
  "甜点",
  "咖啡",
  "快餐",
  "小吃",
  "食阁",
  "其他",
];

export default async function AddPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="text-2xl font-bold text-stone-900">添加餐厅</h1>
      <p className="mt-1 text-sm text-stone-500">
        分享一家 NTU 附近的美食，帮大家解决「今天吃什么」
      </p>

      <form
        action={addRestaurant}
        className="mt-6 space-y-4 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm"
      >
        <Field label="店名 *">
          <input
            name="name"
            required
            placeholder="例如：小杨生煎"
            className={inputCls}
          />
        </Field>

        <Field label="菜系 *">
          <input
            name="cuisine"
            required
            list="cuisine-list"
            placeholder="例如：中餐"
            className={inputCls}
          />
          <datalist id="cuisine-list">
            {cuisines.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
        </Field>

        <Field label="位置 *">
          <input
            name="address"
            required
            placeholder="例如：Pioneer MRT 步行 5 分钟"
            className={inputCls}
          />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="人均最低价 (SGD)">
            <input
              name="priceMin"
              type="number"
              min="0"
              placeholder="5"
              className={inputCls}
            />
          </Field>
          <Field label="人均最高价 (SGD)">
            <input
              name="priceMax"
              type="number"
              min="0"
              placeholder="10"
              className={inputCls}
            />
          </Field>
        </div>

        <Field label="简介">
          <textarea
            name="description"
            rows={3}
            placeholder="口味、招牌菜、排队情况…"
            className={inputCls}
          />
        </Field>

        <Field label="标签（逗号分隔）">
          <input name="tags" placeholder="宵夜,适合聚餐,便宜" className={inputCls} />
        </Field>

        <Field label="营业时间">
          <input name="hours" placeholder="例如：10:00–22:00" className={inputCls} />
        </Field>

        <Field label="电话">
          <input name="phone" placeholder="例如：+65 6xxx xxxx" className={inputCls} />
        </Field>

        <Field label="小红书参考链接">
          <input
            name="sourceUrl"
            type="url"
            placeholder="https://www.xiaohongshu.com/…"
            className={inputCls}
          />
        </Field>

        <Field label="封面图链接（可选，外链图片）">
          <input name="imageUrl" type="url" placeholder="https://…" className={inputCls} />
        </Field>

        <button
          type="submit"
          className="w-full rounded-full bg-orange-600 py-2.5 font-medium text-white transition hover:bg-orange-700"
        >
          提交
        </button>
      </form>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-stone-700">
        {label}
      </span>
      {children}
    </label>
  );
}
