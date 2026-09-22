import { cookies } from "next/headers";
import { getRequestConfig } from "next-intl/server";
import { defaultLocale, isLocale } from "@/config/i18n";

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const requestedLocale = cookieStore.get("locale")?.value;
  const locale = isLocale(requestedLocale) ? requestedLocale : defaultLocale;
  const [messages, customerMessages, productMessages] = await Promise.all([
    import(`../messages/${locale}.json`),
    import(`../messages/${locale}/customer.json`),
    import(`../messages/${locale}/product.json`),
  ]);

  return {
    locale,
    messages: {
      ...messages.default,
      ...customerMessages.default,
      ...productMessages.default,
    },
  };
});
