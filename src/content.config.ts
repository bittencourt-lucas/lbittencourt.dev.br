import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const projects = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/projects" }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    industry: z.enum([
      "fintech",
      "edtech",
      "communications",
      "api-integration",
      "other",
    ]),
    stack: z.array(z.string()),
    outcomes: z.array(z.string()),
    featured: z.boolean().default(false),
    order: z.number().optional(),
  }),
});

export const collections = { projects };
