export abstract class CreateTestimoniosDto {
    abstract titulo: string;
    abstract descripcion: string | null;
    abstract activo: boolean;
    abstract aprobar: boolean;
    abstract notificacion: boolean;
    abstract habilitado: boolean;
}

export abstract class UpdateTestimoniosDto {
    abstract titulo?: string;
    abstract descripcion?: string;
    abstract activo?: boolean;
    abstract aprobar?: boolean;
    abstract notificacion?: boolean;
    abstract habilitado?: boolean;
}

export abstract class CreateTestimonioDto {
    abstract nombre: string;
    abstract apellido: string;
    abstract correo: string;
    abstract descripcion: string;
    abstract calificacion: number | null;
    abstract status: string;
}

export abstract class UpdateTestimonioDto {
    abstract nombre?: string;
    abstract apellido?: string;
    abstract correo?: string;
    abstract descripcion?: string;
    abstract calificacion?: number;
    abstract status?: string;
}
