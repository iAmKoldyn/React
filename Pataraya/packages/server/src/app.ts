// импорт всех зависимостей
import express from "express";
import morgan from "morgan";
import cors from "cors";
import { initTRPC } from "@trpc/server";
import * as trpcExpress from "@trpc/server/adapters/express";
import { PrismaClient } from "@prisma/client";
import {
    createNoteSchema,
    filterQuery,
    params,
    updateNoteSchema,
} from "./note.schema";
import {
    createNoteController,
    deleteNote,
    findAllNotesController,
    findNoteController,
    updateNoteController,
} from "./note.controller";

// инстанс призмавского client`a()
export const prisma = new PrismaClient();
// инициализация  trpc сервера
const t = initTRPC.create();

// роутер для вызова всех RPC процедур
const appRouter = t.router({
  ricRoll: t.procedure.query((req) => {
        return { message: "Never Gonna Give You Up" };
    }),
    createNote: t.procedure
        .input(createNoteSchema)
        .mutation(({ input }) => createNoteController({ input })),
    updateNote: t.procedure
        .input(updateNoteSchema)
        .mutation(({ input }) =>
            updateNoteController({ paramsInput: input.params, input: input.body })
        ),
    deleteNote: t.procedure
        .input(params)
        .mutation(({ input }) => deleteNote({ paramsInput: input })),
    getNote: t.procedure
        .input(params)
        .query(({ input }) => findNoteController({ paramsInput: input })),
    getNotes: t.procedure
        .input(filterQuery)
        .query(({ input }) => findAllNotesController({ filterQuery: input })),
});

export type AppRouter = typeof appRouter;

const app = express();
if (process.env.NODE_ENV !== "production") app.use(morgan("dev"));

// инстанс express приложения
app.use(
    cors({
        origin: ["http://localhost:3000"],
        credentials: true,
    })
);
// добавление trpc middleware в express.js middleware
app.use(
    "/api/trpc",
    trpcExpress.createExpressMiddleware({
        router: appRouter,
    })
);

const port = 8000;
//запускаем сервер вызывая listen()
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
