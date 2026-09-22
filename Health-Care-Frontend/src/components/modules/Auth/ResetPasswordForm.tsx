"use client";

import AppField from "@/components/shared/form/AppField";
import AppSubmitButton from "@/components/shared/form/AppSubmitButton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import dnaBg from "@/assets/dna-bg.png";
import Logo from "@/components/shared/Logo";
import { z } from "zod";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { CalendarCheck2, Eye, EyeOff, ShieldCheck, Stethoscope } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const resetPasswordSchema = z.object({
  email: z.email("Invalid email address"),
  otp: z.string().trim().min(6, "OTP must be 6 digits").max(6, "OTP must be 6 digits"),
  newPassword: z.string().min(8, "Password must be at least 8 characters long"),
});

type ResetPasswordPayload = z.infer<typeof resetPasswordSchema>;

const resetPasswordAction = async (payload: ResetPasswordPayload) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/reset-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.message || "Password reset failed");
  }

  return data;
};

const ResetPasswordForm = ({ defaultEmail = "" }: { defaultEmail?: string }) => {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (payload: ResetPasswordPayload) => resetPasswordAction(payload),
  });

  const form = useForm({
    defaultValues: {
      email: defaultEmail,
      otp: "",
      newPassword: "",
    },
    onSubmit: async ({ value }) => {
      setServerError(null);

      const parsed = resetPasswordSchema.safeParse(value);
      if (!parsed.success) {
        setServerError(parsed.error.issues[0]?.message || "Invalid reset data");
        return;
      }

      try {
        setSuccessMessage(null);
        await mutateAsync(parsed.data);
        setSuccessMessage("Password reset successful. Redirecting to login...");
        setTimeout(() => router.push("/login"), 1200);
      } catch (error: any) {
        setServerError(error?.message || "Password reset failed");
      }
    },
  });

  const features = [
    { icon: ShieldCheck, label: "Secure" },
    { icon: Stethoscope, label: "Trusted Doctors" },
    { icon: CalendarCheck2, label: "Easy Booking" },
  ];

  return (
    <div className="min-h-screen bg-[#edf3ee] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-[1200px] overflow-hidden rounded-[30px] border border-[#d6e0db] bg-[#f2f7f3] shadow-[0_30px_90px_rgba(18,46,37,0.08)]">
        <section className="relative hidden flex-1 flex-col justify-between overflow-hidden bg-[#edf3ee] p-8 lg:flex">
          <div className="absolute inset-0">
            <Image src={dnaBg} alt="" fill priority className="object-cover object-center opacity-80" />
            <div className="absolute inset-0 bg-[#edf3ee]/15" />
          </div>

          <div className="relative z-10 flex items-center gap-3">
            <Logo />
          </div>

          <div className="relative z-10 max-w-[480px]">
            <p className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-[#1d5b4b]">Restore access</p>
            <h1 className="text-[3.1rem] font-medium leading-[0.95] tracking-[-0.06em] text-[#122b26]">
              Set a fresh password and get back in securely.
            </h1>
            <p className="mt-5 max-w-[440px] text-base leading-7 text-[#3a504b]">
              Use the OTP you received to verify your identity, then choose a strong new password for your account.
            </p>
          </div>

          <div className="relative z-10 mt-8 grid grid-cols-3 gap-4">
            {features.map(({ icon: Icon, label }) => (
              <div key={label} className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-white/40 bg-white/40 px-3 py-4 backdrop-blur-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-[#1c5b4d] shadow-sm">
                  <Icon className="h-4 w-4" />
                </div>
                <span className="text-center text-xs text-[#1a2d29]">{label}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="w-full bg-white/75 p-5 sm:p-7 lg:w-[46%] lg:p-8">
          <div className="mb-8 flex justify-end text-sm text-[#2a3a35]">
            <span>
              Need to sign in again? <Link href="/login" className="font-semibold text-[#1d5b4b] hover:underline">Log In</Link>
            </span>
          </div>

          <div className="mx-auto max-w-[420px]">
            <div className="mb-6">
              <h2 className="text-[2.4rem] font-semibold tracking-[-0.05em] text-[#112b26]">Reset Password</h2>
              <p className="mt-2 text-sm text-[#4d605c]">Enter the OTP and choose a new password.</p>
            </div>

            <form
              method="POST"
              action="#"
              noValidate
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                form.handleSubmit();
              }}
              className="space-y-4"
            >
              <form.Field name="email" validators={{ onChange: resetPasswordSchema.shape.email }}>
                {(field) => (
                  <AppField
                    field={field}
                    label="Email"
                    type="email"
                    placeholder="Enter your email"
                    className="rounded-xl border-[#dfe8e3] bg-[#f6faf7] px-3 py-2.5 text-base shadow-none"
                  />
                )}
              </form.Field>

              <form.Field name="otp" validators={{ onChange: resetPasswordSchema.shape.otp }}>
                {(field) => (
                  <AppField
                    field={field}
                    label="OTP"
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    className="rounded-xl border-[#dfe8e3] bg-[#f6faf7] px-3 py-2.5 text-base shadow-none"
                  />
                )}
              </form.Field>

              <form.Field name="newPassword" validators={{ onChange: resetPasswordSchema.shape.newPassword }}>
                {(field) => (
                  <AppField
                    field={field}
                    label="New Password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a new password"
                    className="rounded-xl border-[#dfe8e3] bg-[#f6faf7] px-3 py-2.5 text-base shadow-none"
                    append={
                      <Button
                        type="button"
                        onClick={() => setShowPassword((value) => !value)}
                        variant="ghost"
                        size="icon"
                        className="cursor-pointer text-[#647772] hover:bg-transparent hover:text-black"
                      >
                        {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                      </Button>
                    }
                  />
                )}
              </form.Field>

              {serverError && (
                <Alert variant="destructive">
                  <AlertDescription>{serverError}</AlertDescription>
                </Alert>
              )}

              {successMessage && (
                <Alert>
                  <AlertDescription>{successMessage}</AlertDescription>
                </Alert>
              )}

              <form.Subscribe selector={(s) => [s.canSubmit, s.isSubmitting] as const}>
                {([canSubmit, isSubmitting]) => (
                  <AppSubmitButton
                    isPending={isSubmitting || isPending}
                    pendingLabel="Resetting..."
                    disabled={!canSubmit}
                    className="mt-2 w-full cursor-pointer rounded-xl bg-[#1d5b4b] px-4 py-3 text-base font-semibold text-white shadow-[0_12px_25px_rgba(29,91,75,0.2)] hover:bg-[#184d41]"
                  >
                    Reset Password
                  </AppSubmitButton>
                )}
              </form.Subscribe>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ResetPasswordForm;
