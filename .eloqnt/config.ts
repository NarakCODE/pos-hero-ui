import { defineConfig } from "@eloqnt/cli";

export default defineConfig({
  srcPath: ["./app", "./components"],
  messages: {
    path: "./messages",
    locales: "infer",
    sourceLocale: "en",
    format: "json",
  },
});
