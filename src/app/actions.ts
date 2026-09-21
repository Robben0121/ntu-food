"use server";

import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

function toInt(v: FormDataEntryValue | null): number | null {
  if (v == null) return null;
  const s = String(v).trim();
  if (!s) return null;
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}

export async function addRestaurant(formData: FormData) {
  await requireUser();

  const name = String(formData.get("name") ?? "").trim();
  const cuisine = String(formData.get("cuisine") ?? "").trim();
  const address = String(formData.get("address") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const imageUrl = String(formData.get("imageUrl") ?? "").trim();
  const tags = String(formData.get("tags") ?? "").trim();
  const hours = String(formData.get("hours") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const sourceUrl = String(formData.get("sourceUrl") ?? "").trim();
  const priceMin = toInt(formData.get("priceMin"));
  const priceMax = toInt(formData.get("priceMax"));

  if (!name || !cuisine || !address) {
    throw new Error("请至少填写店名、菜系和位置");
  }

  const restaurant = await prisma.restaurant.create({
    data: {
      name,
      cuisine,
      address,
      description: description || null,
      imageUrl: imageUrl || null,
      tags,
      hours: hours || null,
      phone: phone || null,
      sourceUrl: sourceUrl || null,
      priceMin,
      priceMax,
    },
  });

  revalidatePath("/");
  redirect(`/restaurant/${restaurant.id}`);
}

export async function addRating(formData: FormData) {
  const user = await requireUser();

  const restaurantId = String(formData.get("restaurantId") ?? "");
  const score = toInt(formData.get("score"));
  const taste = toInt(formData.get("taste"));
  const environment = toInt(formData.get("environment"));
  const value = toInt(formData.get("value"));

  if (!restaurantId) throw new Error("缺少餐厅 ID");
  if (!score || score < 1 || score > 5) throw new Error("请选择 1-5 星评分");

  await prisma.rating.create({
    data: { restaurantId, userId: user.id, score, taste, environment, value },
  });

  // 重新计算综合评分并写入餐厅（冗余存储，方便列表排序）
  const agg = await prisma.rating.aggregate({
    where: { restaurantId },
    _avg: { score: true },
    _count: true,
  });

  await prisma.restaurant.update({
    where: { id: restaurantId },
    data: { avgRating: agg._avg.score ?? 0, ratingCount: agg._count },
  });

  revalidatePath("/");
  revalidatePath(`/restaurant/${restaurantId}`);
  redirect(`/restaurant/${restaurantId}`);
}

export async function addComment(formData: FormData) {
  const user = await requireUser();

  const restaurantId = String(formData.get("restaurantId") ?? "");
  const content = String(formData.get("content") ?? "").trim();

  if (!restaurantId) throw new Error("缺少餐厅 ID");
  if (!content) throw new Error("评论内容不能为空");

  await prisma.comment.create({
    data: { restaurantId, userId: user.id, content },
  });

  revalidatePath(`/restaurant/${restaurantId}`);
  redirect(`/restaurant/${restaurantId}`);
}
