import Link from "next/link";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import RestaurantCard from "@/components/RestaurantCard";
import RandomButton from "@/components/RandomButton";
import AutoSubmitSelect from "@/components/AutoSubmitSelect";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q.trim() : "";
  const cuisine = typeof sp.cuisine === "string" ? sp.cuisine : "";
  const sort = typeof sp.sort === "string" ? sp.sort : "rating";

  const where: Prisma.RestaurantWhereInput = {};
  if (q) {
    where.OR = [
      { name: { contains: q } },
      { cuisine: { contains: q } },
      { description: { contains: q } },
      { tags: { contains: q } },
      { address: { contains: q } },
    ];
  }
  if (cuisine) where.cuisine = cuisine;

  const orderBy: Prisma.RestaurantOrderByWithRelationInput =
    sort === "priceAsc"
      ? { priceMin: "asc" }
      : sort === "priceDesc"
        ? { priceMin: "desc" }
        : sort === "newest"
          ? { createdAt: "desc" }
          : { avgRating: "desc" };

  const [restaurants, cuisines] = await Promise.all([
    prisma.restaurant.findMany({
      where,
      orderBy,
      include: { _count: { select: { comments: true } } },
    }),
    prisma.restaurant.findMany({
      distinct: ["cuisine"],
      select: { cuisine: true },
      orderBy: { cuisine: "asc" },
    }),
  ]);

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
        <form method="GET" action="/" className="space-y-3">
          <div className="flex gap-2">
            <input
              name="q"
              defaultValue={q}
              placeholder="搜索店名、菜系、标签、位置…"
              className="w-full rounded-full border border-stone-200 px-4 py-2 text-sm focus:border-orange-400 focus:outline-none"
            />
            <button
              type="submit"
              className="shrink-0 rounded-full bg-orange-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-orange-700"
            >
              搜索
            </button>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <AutoSubmitSelect
              name="cuisine"
              defaultValue={cuisine}
              className="rounded-full border border-stone-200 bg-white px-3 py-2 text-sm focus:border-orange-400 focus:outline-none"
            >
              <option value="">全部菜系</option>
              {cuisines.map((c) => (
                <option key={c.cuisine} value={c.cuisine}>
                  {c.cuisine}
                </option>
              ))}
            </AutoSubmitSelect>
            <AutoSubmitSelect
              name="sort"
              defaultValue={sort}
              className="rounded-full border border-stone-200 bg-white px-3 py-2 text-sm focus:border-orange-400 focus:outline-none"
            >
              <option value="rating">评分最高</option>
              <option value="newest">最新添加</option>
              <option value="priceAsc">价格从低到高</option>
              <option value="priceDesc">价格从高到低</option>
            </AutoSubmitSelect>
            <RandomButton ids={restaurants.map((r) => r.id)} />
          </div>
        </form>
      </section>

      {restaurants.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-stone-300 bg-white p-10 text-center">
          <p className="text-3xl">🍽️</p>
          <p className="mt-2 font-medium text-stone-700">
            {q || cuisine ? "没有找到符合条件的餐厅" : "还没有餐厅"}
          </p>
          <p className="mt-1 text-sm text-stone-400">
            {q || cuisine ? "换个关键词试试吧" : "来添加第一家 NTU 附近的美食吧"}
          </p>
          {!q && !cuisine && (
            <Link
              href="/add"
              className="mt-4 inline-block rounded-full bg-orange-600 px-5 py-2 text-sm font-medium text-white hover:bg-orange-700"
            >
              + 添加餐厅
            </Link>
          )}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {restaurants.map((r) => (
            <RestaurantCard key={r.id} restaurant={r} />
          ))}
        </div>
      )}
    </div>
  );
}
