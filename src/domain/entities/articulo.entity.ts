
export class Articulo{
    constructor(
        public id: string,
        public nro_articulo: number,
        public titulo: string,
        public subtitulo: string,
        public autor: string,
        public fecha_publicacion: Date,
        public fecha_actualizacion: Date | null,
        public status: string,
        public slug: string,
        public autor_id: string,
        public proyecto_id: string,
    ){}
}