"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { createSession, deleteSession } from "@/lib/session";

export type AuthState = { error?: string } | undefined;

function field(v: FormDataEntryValue | null): string {
  return v == null ? "" : String(v).trim();
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function signup(
  prev: AuthState,
  formData: FormData
): Promise<AuthState> {
  const name = field(formData.get("name"));
  const email = field(formData.get("email")).toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!name) return { error: "请填写昵称" };
  if (!EMAIL_RE.test(email)) return { error: "请输入有效的邮箱" };
  if (password.length < 8) return { error: "密码至少 8 位" };

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return { error: "该邮箱已注册，请直接登录" };

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { name, email, passwordHash },
  });

  await createSession(user.id);
  redirect("/");
}

export async function login(
  prev: AuthState,
  formData: FormData
): Promise<AuthState> {
  const email = field(formData.get("email")).toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) return { error: "请填写邮箱和密码" };

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return { error: "邮箱或密码错误" };
  }

  await createSession(user.id);
  redirect("/");
}

export async function logout() {
  await deleteSession();
  redirect("/");
}
