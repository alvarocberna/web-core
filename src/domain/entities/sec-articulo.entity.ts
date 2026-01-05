
export class SecArticuloEntity {
    constructor(
        public id: string,
        public nro_seccion: number,
        public titulo_sec: string,
        public contenido_sec: string,
        public image: string,
        public articulo_id: string,
        public proyecto_id: string,
    ){}
}