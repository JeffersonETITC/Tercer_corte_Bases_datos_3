import { ObjectId } from "mongodb";
import { Libro, LibroDTO } from "./libro.model";
import { LibroRepository } from "./libro.repository";
import { BadRequestError, NotFoundError } from "../../shared/errors/AppError";

export class LibroService {

    private readonly libroRepository = new LibroRepository();

    async create(data: LibroDTO): Promise<Libro> {
        const titulo = this.requireString(data?.titulo, "titulo");
        const autor = this.requireString(data?.autor, "autor");
        const isbn = this.requireString(data?.isbn, "isbn");
        const genero = this.requireString(data?.genero, "genero");
        const anioPublicacion = this.requireYear(data?.anioPublicacion);

        const now = new Date();
        return this.libroRepository.create({
            titulo,
            autor,
            isbn,
            anioPublicacion,
            genero,
            createdAt: now,
            updatedAt: now,
        });
    }

    async findAll(): Promise<Libro[]> {
        return this.libroRepository.findAll();
    }

    async findById(id: string): Promise<Libro> {
        const libro = await this.libroRepository.findById(this.toObjectId(id));
        if (!libro) {
            throw new NotFoundError("Libro no encontrado");
        }
        return libro;
    }

    async update(id: string, data: LibroDTO): Promise<Libro> {
        const objectId = this.toObjectId(id);
        const changes: Partial<Libro> = {};

        if (data.titulo !== undefined) changes.titulo = this.requireString(data.titulo, "titulo");
        if (data.autor !== undefined) changes.autor = this.requireString(data.autor, "autor");
        if (data.isbn !== undefined) changes.isbn = this.requireString(data.isbn, "isbn");
        if (data.genero !== undefined) changes.genero = this.requireString(data.genero, "genero");
        if (data.anioPublicacion !== undefined) changes.anioPublicacion = this.requireYear(data.anioPublicacion);

        if (Object.keys(changes).length === 0) {
            throw new BadRequestError("No se enviaron campos para actualizar");
        }
        changes.updatedAt = new Date();

        const updated = await this.libroRepository.update(objectId, changes);
        if (!updated) {
            throw new NotFoundError("Libro no encontrado");
        }
        return updated;
    }

    async delete(id: string): Promise<void> {
        const deleted = await this.libroRepository.delete(this.toObjectId(id));
        if (!deleted) {
            throw new NotFoundError("Libro no encontrado");
        }
    }

    private requireString(value: unknown, field: string): string {
        if (typeof value !== "string" || value.trim() === "") {
            throw new BadRequestError(`El campo '${field}' es obligatorio y debe ser un texto no vacío`);
        }
        return value.trim();
    }

    private requireYear(value: unknown): number {
        const currentYear = new Date().getFullYear();
        if (typeof value !== "number" || !Number.isInteger(value) || value < 0 || value > currentYear) {
            throw new BadRequestError(`El campo 'anioPublicacion' debe ser un año válido entre 0 y ${currentYear}`);
        }
        return value;
    }

    private toObjectId(id: string): ObjectId {
        if (!ObjectId.isValid(id)) {
            throw new BadRequestError(`Identificador inválido: ${id}`);
        }
        return new ObjectId(id);
    }
}
