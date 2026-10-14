
import ChangePasswordForm from "@/components/modules/Auth/ChangePasswordForm";
import { KeyRound, ShieldCheck } from "lucide-react";

export default function ChangePasswordPage() {
  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 lg:py-12">
      <header className="mb-8 border-b border-[#dce7df] pb-6">
        <div className="flex items-center gap-3">
          <span className="flex size-11 items-center justify-center rounded-md bg-[#e7f3eb] text-[#1f5c4b]">
            <KeyRound className="size-5" aria-hidden="true" />
          </span>
          <div>
            <p className="text-sm font-medium text-[#4d7765]">Account security</p>
            <h1 className="text-2xl font-semibold text-[#173a31]">Change password</h1>
          </div>
        </div>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-[#61736b]">
          Update your password to keep your DocLink account secure. This setting is available to every account role.
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_16rem]">
        <ChangePasswordForm />
        <aside className="h-fit border-l-2 border-[#b8d8c4] pl-4 text-sm text-[#60736b]">
          <ShieldCheck className="mb-3 size-5 text-[#33825e]" aria-hidden="true" />
          <h2 className="font-semibold text-[#173a31]">Password guidance</h2>
          <p className="mt-2 leading-6">
            Use at least 8 characters. Choose a password you do not use for other accounts.
          </p>
        </aside>
      </div>
    </main>
  );
}