import { Prisma } from "@prisma/client";

// 列表页餐厅（附带评论数）
export type RestaurantListItem = Prisma.RestaurantGetPayload<{
  include: { _count: { select: { comments: true } } };
}>;

// 详情页餐厅（附带评论列表）
export type RestaurantDetail = Prisma.RestaurantGetPayload<{
  include: { comments: { orderBy: { createdAt: "desc" } } };
}>;
