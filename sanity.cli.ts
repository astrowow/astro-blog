import { loadEnvConfig } from "@next/env";
import { defineCliConfig } from "sanity/cli";

const dev = process.env.NODE_ENV !== "production";
loadEnvConfig(__dirname, dev, { info: () => null, error: console.error });

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;

export default defineCliConfig({
  api: { projectId, dataset },
  vite: {
    define: {
      "process.env.NEXT_PUBLIC_SANITY_PROJECT_ID": JSON.stringify(projectId),
      "process.env.NEXT_PUBLIC_SANITY_DATASET": JSON.stringify(dataset),
    },
    resolve: {
      alias: {
        "@": __dirname,
      },
    },
  },
});
