"use client";

import { useState } from "react";
import { addRating } from "@/app/actions";

function StarRow({
  label,
  name,
  value,
  onChange,
}: {
  label: string;
  name: string;
  value: number;
  onChange: (n: number) => void;
}) {
  const [hover, setHover] = useState(0);
  const shown = hover || value;
  return (
    <div className="flex items-center gap-3">
      <span className="w-20 shrink-0 text-sm text-stone-500">{label}</span>
      <input type="hidden" name={name} value={value || ""} />
      <div className="flex text-2xl">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onMouseEnter={() => setHover(n)}
            onMouseLeave={() => setHover(0)}
            onClick={() => onChange(value === n ? 0 : n)}
            className={`px-0.5 transition ${
              n <= shown ? "text-amber-400" : "text-stone-300"
            }`}
            aria-label={`${n} 星`}
          >
            ★
          </button>
        ))}
      </div>
    </div>
  );
}

export default function RatingForm({ restaurantId }: { restaurantId: string }) {
  const [score, setScore] = useState(0);
  const [taste, setTaste] = useState(0);
  const [environment, setEnvironment] = useState(0);
  const [value, setValue] = useState(0);

  return (
    <form
      action={addRating}
      className="space-y-3 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm"
    >
      <input type="hidden" name="restaurantId" value={restaurantId} />
      <h2 className="font-semibold text-stone-900">给这家店打分</h2>

      <StarRow label="综合评分 *" name="score" value={score} onChange={setScore} />
      <StarRow label="口味" name="taste" value={taste} onChange={setTaste} />
      <StarRow label="环境" name="environment" value={environment} onChange={setEnvironment} />
      <StarRow label="性价比" name="value" value={value} onChange={setValue} />

      <button
        type="submit"
        disabled={score === 0}
        className="rounded-full bg-orange-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:bg-stone-300"
      >
        提交评分
      </button>
    </form>
  );
}
