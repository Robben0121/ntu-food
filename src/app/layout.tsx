import type { Metadata } from "next";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { logout } from "@/app/actions/auth";
import "./globals.css";

export const metadata: Metadata = {
  title: "NTU 附近美食",
  description: "南洋理工大学附近的美食地图 — 真实评分、发现今天吃什么",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  return (
    <html lang="zh-CN">
      <body className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-10 border-b border-stone-200 bg-white/80 backdrop-blur">
          <div className="mx-auto flex h-14 w-full max-w-4xl items-center justify-between px-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-lg font-bold text-stone-900"
            >
              <span aria-hidden>🍜</span> NTU 附近美食
            </Link>
            <div className="flex items-center gap-3">
              {user ? (
                <>
                  <span className="text-sm text-stone-600">👤 {user.name}</span>
                  <form action={logout}>
                    <button
                      type="submit"
                      className="text-sm text-stone-500 transition hover:text-stone-800"
                    >
                      退出
                    </button>
                  </form>
                </>
              ) : (
                <Link
                  href="/login"
                  className="text-sm font-medium text-stone-600 transition hover:text-orange-600"
                >
                  登录
                </Link>
              )}
              <Link
                href="/add"
                className="rounded-full bg-orange-600 px-4 py-1.5 text-sm font-medium text-white transition hover:bg-orange-700"
              >
                + 添加餐厅
              </Link>
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-6">
          {children}
        </main>

        <footer className="border-t border-stone-200 py-6 text-center text-xs text-stone-400">
          NTU 附近美食 · 由 NTU 学生共同维护
        </footer>
      </body>
    </html>
  );
}
