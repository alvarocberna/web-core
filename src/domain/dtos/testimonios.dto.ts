export abstract class CreateTestimoniosDto {
    abstract titulo: string;
    abstract descripcion: string | null;
    abstract activo: boolean;
}

export abstract class UpdateTestimoniosDto {
    abstract titulo: string;
    abstract descripcion: string | null;
    abstract activo: boolean;
}

export abstract class CreateTestimonioDto {
    abstract nombre: string;
    abstract apellido: string;
    abstract correo: string;
    abstract descripcion: string;
    abstract calificacion: number | null;
}

export abstract class UpdateTestimonioDto {
    abstract nombre: string;
    abstract apellido: string;
    abstract correo: string;
    abstract descripcion: string;
    abstract calificacion: number | null;
    abstract aprobado: boolean;
}
