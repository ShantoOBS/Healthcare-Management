import VerifyEmailForm from "@/components/modules/Auth/VerifyEmailForm";

const VerifyEmailPage = async ({
  searchParams,
}: {
  searchParams?: Promise<{ email?: string }>;
}) => {
  const params = searchParams ? await searchParams : {};

  return <VerifyEmailForm defaultEmail={params.email ?? ""} />;
};

export default VerifyEmailPage;