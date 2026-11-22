import { defineCollection, z } from 'astro:content';

const sermonsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    scripture: z.string().optional().default(''),
    preacher: z.string().optional().default('Pastor Vernon Welkner'),
    youtube: z.string().optional().default(''),
  }),
});

const bulletinsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    coverImage: z.string().optional(),
    insideImage: z.string().optional(),
    notesImage: z.string().optional(),
    pages: z.array(z.object({
      title: z.string(),
      image: z.string(),
    })).optional(),
    pdfFile: z.string().optional(),
    announcements: z.string().optional(),
  }),
});

export const collections = {
  sermons: sermonsCollection,
  bulletins: bulletinsCollection,
};
