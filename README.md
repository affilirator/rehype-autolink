# rehype-autolink

An Astro + Rehype plugin that automatically links phrases in your **blog posts** based on a JSON config file.

## Installation

```bash
npm install rehype-autolink
```

## Usage (Astro)

In your `astro.config.mjs` (or `.ts`):

```ts
import { defineConfig } from "astro/config";
import { rehypeAutoLink } from "rehype-autolink";

export default defineConfig({
  markdown: {
    rehypePlugins: [
      [rehypeAutoLink, "./src/data/linkData.json"]
    ]
  }
});
```

- `./src/data/linkData.json` is your JSON config file with link rules.

## JSON Format

```json
{
  "maxLinks": 5,
  "entries": [
    {
      "id": "forex-broker",
      "href": "/brokers/forex",
      "maxOccurrences": 2,
      "texts": [
        { "id": "t1", "text": "Forex broker" },
        { "id": "t2", "text": "broker" }
      ]
    }
  ]
}
```

- `maxLinks` = global max links allowed per page
- Each `entry` = target link rule
- `texts` = variations of the phrase to link
- `maxOccurrences` = per-entry limit

## License

MIT