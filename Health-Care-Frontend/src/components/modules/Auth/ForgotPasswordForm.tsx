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
import { CalendarCheck2, ShieldCheck, Stethoscope } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const OTP_EXPIRES_IN_SECONDS = 120;

const forgotPasswordSchema = z.object({
  email: z.email("Invalid email address"),
});

type ForgotPasswordPayload = z.infer<typeof forgotPasswordSchema>;

const forgetPasswordAction = async (payload: ForgotPasswordPayload) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/forget-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.message || "Unable to send OTP");
  }

  return data;
};

const ForgotPasswordForm = () => {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(0);
  const [isOtpTimerRunning, setIsOtpTimerRunning] = useState(false);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (payload: ForgotPasswordPayload) => forgetPasswordAction(payload),
  });

  useEffect(() => {
    if (!isOtpTimerRunning) return;
    if (countdown <= 0) {
      setIsOtpTimerRunning(false);
      return;
    }

    const timer = window.setTimeout(() => {
      setCountdown((prev) => Math.max(prev - 1, 0));
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [countdown, isOtpTimerRunning]);

  const startOtpTimer = () => {
    setCountdown(OTP_EXPIRES_IN_SECONDS);
    setIsOtpTimerRunning(true);
  };

  const form = useForm({
    defaultValues: {
      email: "",
    },
    onSubmit: async ({ value }) => {
      setServerError(null);
      const parsed = forgotPasswordSchema.safeParse(value);
      if (!parsed.success) {
        setServerError(parsed.error.issues[0]?.message || "Invalid email");
        return;
      }

      try {
        setSuccessMessage(null);
        await mutateAsync(parsed.data);
        setSuccessMessage("A password reset OTP has been sent to your email.");
        startOtpTimer();
        router.push(`/reset-password?email=${encodeURIComponent(parsed.data.email)}`);
      } catch (error: any) {
        setServerError(error?.message || "Unable to send OTP");
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
            <p className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-[#1d5b4b]">Reset access</p>
            <h1 className="text-[3.1rem] font-medium leading-[0.95] tracking-[-0.06em] text-[#122b26]">
              Recover your account with a secure reset code.
            </h1>
            <p className="mt-5 max-w-[440px] text-base leading-7 text-[#3a504b]">
              Enter your email and we will send a one-time password to help you reset your login safely.
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
              Remember your password? <Link href="/login" className="font-semibold text-[#1d5b4b] hover:underline">Log In</Link>
            </span>
          </div>

          <div className="mx-auto max-w-[420px]">
            <div className="mb-6">
              <h2 className="text-[2.4rem] font-semibold tracking-[-0.05em] text-[#112b26]">Forgot Password</h2>
              <p className="mt-2 text-sm text-[#4d605c]">Enter your account email to receive a reset OTP.</p>
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
              <form.Field name="email" validators={{ onChange: forgotPasswordSchema.shape.email }}>
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

              <div className="flex items-center justify-between gap-3 rounded-xl border border-[#dfe8e3] bg-[#f6faf7] px-3 py-2 text-sm text-[#455b57]">
                <span>
                  {countdown > 0
                    ? `Resend in ${Math.floor(countdown / 60).toString().padStart(2, "0")}:${(countdown % 60).toString().padStart(2, "0")}`
                    : "Need a new code?"}
                </span>

                <Button
                  type="button"
                  variant="ghost"
                  className="h-auto px-2 py-1 text-sm font-medium text-[#1d5b4b] hover:bg-transparent hover:text-[#184d41] disabled:cursor-not-allowed disabled:opacity-50"
                  onClick={() => {
                    const email = form.state.values.email;
                    if (!email) {
                      setServerError("Please enter your email first.");
                      return;
                    }

                    form.handleSubmit();
                  }}
                  disabled={isPending || countdown > 0}
                >
                  {isPending ? "Sending..." : countdown > 0 ? "Wait" : "Get OTP"}
                </Button>
              </div>

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
                    pendingLabel="Sending..."
                    disabled={!canSubmit}
                    className="mt-2 w-full cursor-pointer rounded-xl bg-[#1d5b4b] px-4 py-3 text-base font-semibold text-white shadow-[0_12px_25px_rgba(29,91,75,0.2)] hover:bg-[#184d41]"
                  >
                    Get OTP
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

export default ForgotPasswordForm;
