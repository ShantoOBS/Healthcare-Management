import ResetPasswordForm from "@/components/modules/Auth/ResetPasswordForm";

const ResetPasswordPage = async ({
  searchParams,
}: {
  searchParams?: Promise<{ email?: string }>;
}) => {
  const params = searchParams ? await searchParams : {};

  return <ResetPasswordForm defaultEmail={params.email ?? ""} />;
};

export default ResetPasswordPage;