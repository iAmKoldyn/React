import { z } from "zod";

// создание 4х валидаторов схем
export const createNoteSchema = z.object({
    title: z.string({
        required_error: "Заголовок обязателен",
    }),
    content: z.string({
        required_error: "Описание обязательно",
    }),
    category: z.string().optional(),
    published: z.boolean().optional(),
});

export const params = z.object({
    noteId: z.string(),
});

export const updateNoteSchema = z.object({
    params,
    body: z
        .object({
            title: z.string(),
            content: z.string(),
            category: z.string(),
            published: z.boolean(),
        })
        .partial(),
});

export const filterQuery = z.object({
    limit: z.number().default(1),
    page: z.number().default(10),
});

//эксопрт их типов TypeScript с помощью Zod TypeOf<> type
export type ParamsInput = z.TypeOf<typeof params>;
export type FilterQueryInput = z.TypeOf<typeof filterQuery>;
export type CreateNoteRequest = z.TypeOf<typeof createNoteSchema>;
export type UpdateNoteRequest = z.TypeOf<typeof updateNoteSchema>;
