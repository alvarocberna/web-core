
export class SecArticulo {
    constructor(
        public id: string,
        public nro_seccion: number,
        public titulo: string,
        public subtitulo: string,
        public contenido: string,
        public image: number,
        public articulo_id: string,
        public proyecto_id: string,
    ){}
}