import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { prisma } from "./app";
import {
    CreateNoteRequest,
    FilterQueryInput,
    ParamsInput,
    UpdateNoteRequest,
} from "./note.schema";

// Созадание tRPC процедур (используются в CRUD)
// Создание/добавление
export const createNoteController = async ({
    input,
}: {
    input: CreateNoteRequest;
}) => {
    try {
        const note = await prisma.note.create({
            data: {
                title: input.title,
                content: input.content,
                category: input.category,
                published: input.published,
            },
        });

        return {
            status: "success",
            data: {
                note,
            },
        };
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === "P2002") {
                throw new TRPCError({
                    code: "CONFLICT",
                    message: "Запись с таким заголовком уже существует",
                });
            }
        }
        throw error;
    }
};

// Обновление
export const updateNoteController = async ({
    paramsInput,
    input,
}: {
    paramsInput: ParamsInput;
    input: UpdateNoteRequest["body"];
}) => {
    try {
        const updatedNote = await prisma.note.update({
            where: { id: paramsInput.noteId },
            data: input,
        });

        return {
            status: "success",
            note: updatedNote,
        };
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === "P2025") {
                throw new TRPCError({
                    code: "CONFLICT",
                    message: "Запись с таким заголовком уже существует",
                });
            }
        }
        throw error;
    }
};

// Получаем одну запись
export const findNoteController = async ({
    paramsInput,
}: {
    paramsInput: ParamsInput;
}) => {
    try {
        const note = await prisma.note.findFirst({
            where: { id: paramsInput.noteId },
        });

        if (!note) {
            throw new TRPCError({
                code: "NOT_FOUND",
                message: "Запись с таки ID не найдена",
            });
        }

        return {
            status: "success",
            note,
        };
    } catch (error) {
        throw error;
    }
};

// Получаем все записи
export const findAllNotesController = async ({
    filterQuery,
}: {
    filterQuery: FilterQueryInput;
}) => {
    try {
        const page = filterQuery.page || 1;
        const limit = filterQuery.limit || 10;
        const skip = (page - 1) * limit;

        const notes = await prisma.note.findMany({ skip, take: limit });

        return {
            status: "success",
            results: notes.length,
            notes,
        };
    } catch (error) {
        throw error;
    }
};

// Удаляем запись
export const deleteNote = async ({
    paramsInput,
}: {
    paramsInput: ParamsInput;
}) => {
    try {
        await prisma.note.delete({ where: { id: paramsInput.noteId } });

        return {
            status: "success",
        };
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === "P2025") {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Запись с таким ID не найдена",
                });
            }
        }
        throw error;
    }
};
