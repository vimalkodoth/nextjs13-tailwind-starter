import Link from "next/link";
import { useTranslation } from "@/i18n";
import { Footer } from "@/components/Footer";
import AuthStatus from "@/components/Auth/AuthStatus";

export default async function Page({ params: { lng } }) {
  const { t } = await useTranslation(lng);
  return (
    <>
      <h1>{t("title")}</h1>
      <AuthStatus />
      <Link href={`/${lng}/second-page`}>{t("to-second-page")}</Link>
      <br />
      <Link href={`/${lng}/client-page`}>{t("to-client-page")}</Link>
      <Footer lng={lng} />
    </>
  );
}
