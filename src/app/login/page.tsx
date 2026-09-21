import type { Metadata } from "next";
import LoginForm from "@/components/LoginForm";

export const metadata: Metadata = { title: "登录" };

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-sm">
      <h1 className="text-2xl font-bold text-stone-900">登录</h1>
      <p className="mt-1 text-sm text-stone-500">
        登录后即可评分、评论和添加餐厅
      </p>

      <div className="mt-6 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
        <LoginForm />
      </div>
    </div>
  );
}
