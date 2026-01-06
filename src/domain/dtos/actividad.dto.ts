export interface ActividadDto {
    id: string;
    accion: string;
    responsable: string;
    fecha: Date;
    proyecto_id: string;
    articulo_id: string | null;
}
