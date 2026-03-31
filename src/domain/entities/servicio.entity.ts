export class ServicioEntity {
    constructor(
        public id: string,
        public nombre_servicio: string,
        public descripcion: string | null,
        public valor: number | null,
        public nombre_promocion: string | null,
        public porcentaje_descuento: number | null,
        public destacado: boolean,
        public icono: string | null,
        public orden: number | null,
        public activo: boolean,
        public slug: string,
        public img_url: string | null,
        public img_alt: string | null,
        public servicios_id: string,
    ) {}
}
