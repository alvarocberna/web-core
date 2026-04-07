
export class ArticuloEntity{
    constructor(
        public id: string,
        public nro_articulo: number,
        public titulo: string,
        public subtitulo: string | null,
        public autor: string,
        public fecha_publicacion: Date,
        public fecha_actualizacion: Date | null,
        public status: string,
        public activo: boolean,
        public slug: string,
        public image_url: string | null,
        public image_alt: string | null,
        public image_position: string | null,
        public proyecto_id: string,
        public usuario_id: string,
        public articulos_id: string,
    ){}
}