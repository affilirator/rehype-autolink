import { defineConfig } from "astro/config";
import { rehypeAutoLink } from "rehype-autolink";

export default defineConfig({
  markdown: {
    rehypePlugins: [
      [rehypeAutoLink, "./src/data/linkData.json"]
    ]
  }
});