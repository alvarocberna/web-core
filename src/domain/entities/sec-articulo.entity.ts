
export class SecArticuloEntity {
    constructor(
        public id: string,
        public nro_seccion: number,
        public titulo_sec: string,
        public contenido_sec: string,
        public image_url: string | null,
        public image_alt: string | null,
        public image_position: string | null,
        public articulo_id: string,
        public proyecto_id: string,
    ){}
}