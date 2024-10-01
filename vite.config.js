import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  // Load environment variables based on the current mode
  const env = loadEnv(mode, process.cwd());

  return {
    server: {
      proxy: {
        "/api": env.VITE_API_URL, // Use the environment variable
      },
    },
  };
});
