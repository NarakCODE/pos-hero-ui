import { defineConfig } from "@eloqnt/cli";

export default defineConfig({
  srcPath: ["./app", "./components"],
  messages: {
    path: [
      {
        source: "./messages/en",
        targets: "./messages/{locale}",
      },
      {
        source: "./messages/en/customer",
        targets: "./messages/{locale}/customer",
      },
      {
        source: "./messages/en/product",
        targets: "./messages/{locale}/product",
      },
    ],
    locales: ["en", "km"],
    sourceLocale: "en",
    format: "json",
  },
});
