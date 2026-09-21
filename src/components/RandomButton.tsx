"use client";

import { useRouter } from "next/navigation";

export default function RandomButton({ ids }: { ids: string[] }) {
  const router = useRouter();

  function pick() {
    if (ids.length === 0) return;
    const id = ids[Math.floor(Math.random() * ids.length)];
    router.push(`/restaurant/${id}`);
  }

  return (
    <button
      type="button"
      onClick={pick}
      disabled={ids.length === 0}
      title={ids.length === 0 ? "还没有餐厅" : "在当前筛选结果里随机挑一家"}
      className="rounded-full bg-amber-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-amber-600 disabled:cursor-not-allowed disabled:bg-stone-300"
    >
      🎲 今天吃什么
    </button>
  );
}
