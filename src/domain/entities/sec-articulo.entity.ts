
export class SecArticuloEntity {
    constructor(
        public id: string,
        public nro_seccion: number,
        public titulo_sec: string | null,
        public contenido_sec: string | null,
        public image_url: string | null,
        public image_alt: string | null,
        public image_position: string | null,
        public proyecto_id: string,
        public articulo_id: string,
    ){}
}