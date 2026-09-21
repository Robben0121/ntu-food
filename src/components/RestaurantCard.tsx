import Link from "next/link";
import StarDisplay from "./StarDisplay";
import { priceLabel, splitTags } from "@/lib/format";
import type { RestaurantListItem } from "@/lib/types";

export default function RestaurantCard({
  restaurant,
}: {
  restaurant: RestaurantListItem;
}) {
  const tags = splitTags(restaurant.tags);

  return (
    <Link
      href={`/restaurant/${restaurant.id}`}
      className="group flex flex-col rounded-2xl border border-stone-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-orange-200 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-stone-900 group-hover:text-orange-700">
          {restaurant.name}
        </h3>
        <span className="shrink-0 rounded-full bg-orange-50 px-2 py-0.5 text-xs font-medium text-orange-700">
          {restaurant.cuisine}
        </span>
      </div>

      <div className="mt-2 flex items-center gap-1.5">
        <StarDisplay rating={restaurant.avgRating} />
        <span className="text-sm font-semibold text-amber-600">
          {restaurant.ratingCount > 0 ? restaurant.avgRating.toFixed(1) : "暂无"}
        </span>
        {restaurant.ratingCount > 0 && (
          <span className="text-xs text-stone-400">
            {restaurant.ratingCount} 人评分
          </span>
        )}
      </div>

      {restaurant.description && (
        <p className="mt-2 line-clamp-2 text-sm text-stone-500">
          {restaurant.description}
        </p>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        <span className="rounded-md bg-stone-100 px-2 py-0.5 text-xs text-stone-600">
          {priceLabel(restaurant.priceMin, restaurant.priceMax)}
        </span>
        {tags.slice(0, 3).map((t) => (
          <span
            key={t}
            className="rounded-md bg-stone-100 px-2 py-0.5 text-xs text-stone-600"
          >
            {t}
          </span>
        ))}
        <span className="ml-auto text-xs text-stone-400">
          💬 {restaurant._count.comments}
        </span>
      </div>

      <p className="mt-2 truncate text-xs text-stone-400">
        📍 {restaurant.address}
      </p>
    </Link>
  );
}
