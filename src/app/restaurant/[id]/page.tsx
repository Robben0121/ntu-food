import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { addComment } from "@/app/actions";
import { getCurrentUser } from "@/lib/auth";
import StarDisplay from "@/components/StarDisplay";
import RatingForm from "@/components/RatingForm";
import { formatDate, priceLabel, splitTags } from "@/lib/format";

export default async function RestaurantPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const restaurant = await prisma.restaurant.findUnique({
    where: { id },
    include: {
      comments: { orderBy: { createdAt: "desc" }, include: { user: true } },
    },
  });

  if (!restaurant) notFound();

  const user = await getCurrentUser();
  const tags = splitTags(restaurant.tags);

  return (
    <div className="space-y-6">
      <Link
        href="/"
        className="inline-block text-sm text-stone-500 hover:text-orange-600"
      >
        ← 返回列表
      </Link>

      <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
        {restaurant.imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={restaurant.imageUrl}
            alt={restaurant.name}
            className="h-56 w-full object-cover"
            referrerPolicy="no-referrer"
          />
        )}
        <div className="p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-stone-900">
                {restaurant.name}
              </h1>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-orange-50 px-2 py-0.5 text-sm font-medium text-orange-700">
                  {restaurant.cuisine}
                </span>
                <span className="text-sm text-stone-500">
                  {priceLabel(restaurant.priceMin, restaurant.priceMax)}
                </span>
              </div>
            </div>
            <div className="sm:text-right">
              <div className="flex items-center gap-2 sm:justify-end">
                <StarDisplay rating={restaurant.avgRating} size="text-2xl" />
              </div>
              <div className="mt-1 text-sm text-stone-500">
                {restaurant.ratingCount > 0
                  ? `${restaurant.avgRating.toFixed(1)} 分 · ${restaurant.ratingCount} 人评分`
                  : "还没有评分"}
              </div>
            </div>
          </div>

          {restaurant.description && (
            <p className="mt-4 text-stone-700">{restaurant.description}</p>
          )}

          <div className="mt-5 grid gap-2 text-sm text-stone-600 sm:grid-cols-2">
            <InfoRow label="📍 位置" value={restaurant.address} />
            {restaurant.hours && (
              <InfoRow label="🕐 营业时间" value={restaurant.hours} />
            )}
            {restaurant.phone && (
              <InfoRow label="📞 电话" value={restaurant.phone} />
            )}
            {tags.length > 0 && (
              <InfoRow label="🏷️ 标签" value={tags.join(" · ")} />
            )}
            {restaurant.sourceUrl && (
              <InfoRow
                label="📕 小红书"
                value={
                  <a
                    href={restaurant.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-orange-600 hover:underline"
                  >
                    查看参考笔记 ↗
                  </a>
                }
              />
            )}
          </div>
        </div>
      </div>

      {user ? (
        <RatingForm restaurantId={restaurant.id} />
      ) : (
        <section className="rounded-2xl border border-dashed border-stone-300 bg-white p-6 text-center">
          <p className="font-medium text-stone-700">登录后即可给这家店打分</p>
          <div className="mt-3 flex justify-center gap-3">
            <Link
              href="/login"
              className="rounded-full bg-orange-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-orange-700"
            >
              登录
            </Link>
            <Link
              href="/signup"
              className="rounded-full border border-stone-300 px-5 py-2 text-sm font-medium text-stone-600 transition hover:bg-stone-50"
            >
              注册
            </Link>
          </div>
        </section>
      )}

      <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-stone-900">
          评论{" "}
          <span className="text-stone-400">({restaurant.comments.length})</span>
        </h2>

        {restaurant.comments.length === 0 ? (
          <p className="mt-3 text-sm text-stone-400">
            还没有评论，来写第一条吧
          </p>
        ) : (
          <ul className="mt-4 space-y-4">
            {restaurant.comments.map((c) => (
              <li key={c.id} className="border-b border-stone-100 pb-4 last:border-0">
                <p className="whitespace-pre-wrap text-sm text-stone-700">
                  {c.content}
                </p>
                <p className="mt-1 text-xs text-stone-400">
                  {c.user?.name ?? "匿名"} · {formatDate(c.createdAt)}
                </p>
              </li>
            ))}
          </ul>
        )}

        {user ? (
          <form action={addComment} className="mt-5 space-y-3">
            <input type="hidden" name="restaurantId" value={restaurant.id} />
            <textarea
              name="content"
              required
              rows={3}
              placeholder="分享你的体验，帮大家避雷或种草…"
              className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm focus:border-orange-400 focus:outline-none"
            />
            <button
              type="submit"
              className="rounded-full bg-orange-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-orange-700"
            >
              发表评论
            </button>
          </form>
        ) : (
          <p className="mt-5 text-sm text-stone-500">
            <Link href="/login" className="text-orange-600 hover:underline">
              登录
            </Link>
            后即可发表评论
          </p>
        )}
      </section>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex gap-2">
      <span className="shrink-0">{label}</span>
      <span className="text-stone-800">{value}</span>
    </div>
  );
}
