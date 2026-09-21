"use client";

import Link from "next/link";
import { useActionState } from "react";
import { signup, type AuthState } from "@/app/actions/auth";

const inputCls =
  "w-full rounded-lg border border-stone-200 px-3 py-2 text-sm focus:border-orange-400 focus:outline-none";

export default function SignupForm() {
  const [state, action, pending] = useActionState<AuthState, FormData>(
    signup,
    undefined
  );

  return (
    <form action={action} className="space-y-4">
      {state?.error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
          {state.error}
        </p>
      )}

      <div className="space-y-1.5">
        <label htmlFor="name" className="text-sm font-medium text-stone-700">
          昵称
        </label>
        <input
          id="name"
          name="name"
          required
          autoComplete="nickname"
          placeholder="例如：干饭人小王"
          className={inputCls}
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="email" className="text-sm font-medium text-stone-700">
          邮箱
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
          className={inputCls}
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="password" className="text-sm font-medium text-stone-700">
          密码（至少 8 位）
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          className={inputCls}
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-orange-600 py-2.5 font-medium text-white transition hover:bg-orange-700 disabled:bg-stone-300"
      >
        {pending ? "注册中…" : "注册"}
      </button>

      <p className="text-center text-sm text-stone-500">
        已有账号？{" "}
        <Link href="/login" className="text-orange-600 hover:underline">
          登录
        </Link>
      </p>
    </form>
  );
}
