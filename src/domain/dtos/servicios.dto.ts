export abstract class CreateServiciosDto {
    abstract titulo: string;
    abstract descripcion: string | null;
    abstract icono: string | null;
    abstract activo: string;
}

export abstract class UpdateServiciosDto {
    abstract titulo: string;
    abstract descripcion: string | null;
    abstract icono: string | null;
    abstract activo: string;
}

export abstract class CreateServicioDto {
    abstract nombre_servicio: string;
    abstract descripcion: string | null;
    abstract valor: string | null;
    abstract nombre_promocion: string | null;
    abstract porcentaje_descuento: string | null;
    abstract destacado: boolean | null;
    abstract icono: string | null;
    abstract orden: string | null;
    abstract activo: string;
    abstract img_url: string;
    abstract img_alt: string;
}

export abstract class UpdateServicioDto {
    abstract nombre_servicio: string;
    abstract descripcion: string | null;
    abstract valor: string | null;
    abstract nombre_promocion: string | null;
    abstract porcentaje_descuento: string | null;
    abstract destacado: boolean | null;
    abstract icono: string | null;
    abstract orden: string | null;
    abstract activo: string;
    abstract img_url: string;
    abstract img_alt: string;
}
