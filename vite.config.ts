import { defineConfig } from "vite"
import dts from "vite-plugin-dts"
import { resolve } from "node:path"

export default defineConfig({
    build: {
        lib: {
            entry: resolve(__dirname, "src/index.ts"),
            formats: ["es", "cjs"],
            fileName: (format) => `index.${format}.js`,
        },
        rollupOptions: {
            external: ["axios", "zod"],
        },
        outDir: "dist",
        minify: false,
        target: "node20",
    },
    plugins: [dts({ rollupTypes: true })],
})
