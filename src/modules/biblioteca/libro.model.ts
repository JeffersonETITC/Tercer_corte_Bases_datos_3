import { ObjectId } from "mongodb";

export interface Libro {
    _id?: ObjectId;
    titulo: string;
    autor: string;
    isbn: string;
    anioPublicacion: number;
    genero: string;
    createdAt: Date;
    updatedAt: Date;
}

/**
 * Datos que el cliente puede enviar sobre un libro.
 * Todos los campos son opcionales; el servicio valida qué es
 * obligatorio según la operación (crear vs. actualizar).
 */
export interface LibroDTO {
    titulo?: string;
    autor?: string;
    isbn?: string;
    anioPublicacion?: number;
    genero?: string;
}
