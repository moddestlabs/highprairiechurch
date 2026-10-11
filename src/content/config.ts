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
    coverImage: z.string().optional().default('/images/cover26-7-5.jpg'),
    insideImage: z.string().optional().default('/images/coverinside26-7-5.jpg'),
    notesImage: z.string().optional().default('/images/insertnotes26-7-5.jpg'),
    pdfFile: z.string().optional(),
    announcements: z.string().optional(),
  }),
});

export const collections = {
  sermons: sermonsCollection,
  bulletins: bulletinsCollection,
};
