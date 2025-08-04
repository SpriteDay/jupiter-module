import { defineConfig } from "vite"

export default defineConfig({
    // Tell Vite that we are building for a custom application, not a browser app.
    appType: "custom",
    build: {
        // The directory where the output will be placed.
        outDir: "dist",
        // Our node entry point.
        ssr: "src/index.ts",
        // We want to control minification ourselves.
        minify: false,
        // Ensure that we are building for a Node.js environment.
        target: "node20",
        rollupOptions: {
            output: {
                // We want to output in ESM format.
                format: "esm",
            },
        },
    },
})
