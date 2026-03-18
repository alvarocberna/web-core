export class ServicioEntity {
    constructor(
        public id: string,
        public nombre_servicio: string,
        public descripcion: string | null,
        public valor: string | null,
        public nombre_promocion: string | null,
        public porcentaje_descuento: string | null,
        public destacado: boolean | null,
        public icono: string | null,
        public orden: string | null,
        public activo: string,
        public img_url: string,
        public img_alt: string,
        public servicios_id: string,
    ) {}
}
