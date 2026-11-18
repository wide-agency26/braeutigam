import { defineConfig } from "vite";
import vinext from "vinext";
import { cloudflare } from "@cloudflare/vite-plugin";
import { imagesOptimizer } from "@vinext/cloudflare/images/images-optimizer";

const root = new URL(".", import.meta.url);
const platformModule = (name: string) => new URL(`lib/cloudflare/${name}.ts`, root).pathname;

export default defineConfig({
  resolve: {
    alias: {
      "@/lib/prisma": platformModule("prisma"),
      "@/lib/storage": platformModule("storage"),
      "@/lib/resume-download": platformModule("resume-download"),
      "@/lib/data/save-application": platformModule("save-application"),
      "@/lib/request-ip": platformModule("request-ip"),
    },
  },
  plugins: [
    vinext({
      images: { optimizer: imagesOptimizer() },
    }),
    cloudflare({
      viteEnvironment: {
        name: "rsc",
        childEnvironments: ["ssr"],
      },
    }),
  ],
});
