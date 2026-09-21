import Link from "next/link";

export default function NotFound() {
  return (
    <div className="rounded-2xl border border-dashed border-stone-300 bg-white p-10 text-center">
      <p className="text-4xl">🤔</p>
      <p className="mt-2 text-lg font-semibold text-stone-800">
        没找到这家餐厅
      </p>
      <p className="mt-1 text-sm text-stone-400">它可能已被删除，或者链接有误</p>
      <Link
        href="/"
        className="mt-4 inline-block rounded-full bg-orange-600 px-5 py-2 text-sm font-medium text-white hover:bg-orange-700"
      >
        返回首页
      </Link>
    </div>
  );
}
