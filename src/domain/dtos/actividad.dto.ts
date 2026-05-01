export interface ActividadDto {
    id: string;
    accion: string;
    titulo_articulo: string;
    responsable: string;
    fecha: Date;
    proyecto_id: string;
    articulo_id: string | null;
}
