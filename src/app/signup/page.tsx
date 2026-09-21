import type { Metadata } from "next";
import SignupForm from "@/components/SignupForm";

export const metadata: Metadata = { title: "注册" };

export default function SignupPage() {
  return (
    <div className="mx-auto max-w-sm">
      <h1 className="text-2xl font-bold text-stone-900">注册</h1>
      <p className="mt-1 text-sm text-stone-500">
        加入 NTU 美食社区，一起记录附近好吃的
      </p>

      <div className="mt-6 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
        <SignupForm />
      </div>
    </div>
  );
}
