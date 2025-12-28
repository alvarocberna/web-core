
export class SecArticuloEntity {
    constructor(
        public id: string,
        public nro_seccion: number,
        public titulo: string,
        public subtitulo: string,
        public contenido: string,
        public image: string,
        public articulo_id: string,
        public proyecto_id: string,
    ){}
}