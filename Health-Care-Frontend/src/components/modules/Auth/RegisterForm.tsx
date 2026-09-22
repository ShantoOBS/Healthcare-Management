"use client";

import { registerAction } from "@/app/(commonLayout)/(authRouteGroup)/register/_action";
import { registerZodSchema, type IRegisterPayload } from "@/zod/auth.validation";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Eye, EyeOff, ShieldCheck, Stethoscope, CalendarCheck2 } from "lucide-react";
import AppField from "@/components/shared/form/AppField";
import AppSubmitButton from "@/components/shared/form/AppSubmitButton";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import dnaBg from "@/assets/dna-bg.png";
import Logo from "@/components/shared/Logo";

const RegisterForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (payload: IRegisterPayload) => registerAction(payload),
  });

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      setServerError(null);

      const parsed = registerZodSchema.safeParse(value);
      if (!parsed.success) {
        setServerError(parsed.error.issues[0]?.message || "Invalid form data");
        return;
      }

      try {
        const result = await mutateAsync(parsed.data) as any;

        if (!result.success) {
          setServerError(result.message || "Registration failed");
          return;
        }
      } catch (error: any) {
        setServerError(error?.message || "Registration failed");
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
            <p className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-[#1d5b4b]">Join Dantora</p>
            <h1 className="text-[3.1rem] font-medium leading-[0.95] tracking-[-0.06em] text-[#122b26]">
              Create your account and take control of your health.
            </h1>
            <p className="mt-5 max-w-[440px] text-base leading-7 text-[#3a504b]">
              Book appointments, consult specialists, and get the care you deserve — all in one place.
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
              Already have an account? <Link href="/login" className="font-semibold text-[#1d5b4b] hover:underline">Log In</Link>
            </span>
          </div>

          <div className="mx-auto max-w-[420px]">
            <div className="mb-6">
              <h2 className="text-[2.4rem] font-semibold tracking-[-0.05em] text-[#112b26]">Create Account</h2>
              <p className="mt-2 text-sm text-[#4d605c]">Fill in your details to get started.</p>
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
              <form.Field name="name" validators={{ onChange: registerZodSchema.shape.name }}>
                {(field) => (
                  <AppField
                    field={field}
                    label="Full Name"
                    type="text"
                    placeholder="Enter your full name"
                    className="rounded-xl border-[#dfe8e3] bg-[#f6faf7] px-3 py-2.5 text-base shadow-none"
                  />
                )}
              </form.Field>

              <form.Field name="email" validators={{ onChange: registerZodSchema.shape.email }}>
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

              <form.Field name="password" validators={{ onChange: registerZodSchema.shape.password }}>
                {(field) => (
                  <AppField
                    field={field}
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
                    className="rounded-xl border-[#dfe8e3] bg-[#f6faf7] px-3 py-2.5 text-base shadow-none"
                    append={
                      <Button
                        type="button"
                        onClick={() => setShowPassword((value) => !value)}
                        variant="ghost"
                        size="icon"
                        className="text-[#647772] hover:bg-transparent hover:text-black cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                      </Button>
                    }
                  />
                )}
              </form.Field>

              <div className="flex items-start gap-2 text-sm text-[#455b57]">
                <input type="checkbox" className="mt-1 h-4 w-4 rounded border-[#dfe8e3] accent-[#1d5b4b]" />
                <label>
                  I agree to the <Link href="#" className="font-medium text-[#1d5b4b] hover:underline">Terms &amp; Conditions</Link> and <Link href="#" className="font-medium text-[#1d5b4b] hover:underline">Privacy Policy</Link>
                </label>
              </div>

              {serverError && (
                <Alert variant="destructive">
                  <AlertDescription>{serverError}</AlertDescription>
                </Alert>
              )}

              <form.Subscribe selector={(s) => [s.canSubmit, s.isSubmitting] as const}>
                {([canSubmit, isSubmitting]) => (
                  <AppSubmitButton
                    isPending={isSubmitting || isPending}
                    pendingLabel="Creating Account..."
                    disabled={!canSubmit}
                    className="mt-2 cursor-pointer w-full rounded-xl bg-[#1d5b4b] px-4 py-3 text-base font-semibold text-white shadow-[0_12px_25px_rgba(29,91,75,0.2)] hover:bg-[#184d41]"
                  >
                    Create Account
                  </AppSubmitButton>
                )}
              </form.Subscribe>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#dfe8e3]" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-3 text-[#5f716a]">Or continue with</span>
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full rounded-xl border-[#dfe8e3] bg-white text-[#1a2d29] shadow-sm hover:bg-[#f4f8f5]"
              onClick={() => {
                const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
                window.location.href = `${baseUrl}/auth/login/google`;
              }}
            >
              <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Sign up with Google
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default RegisterForm;
