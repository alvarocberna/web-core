
export class ActividadEntity{
    constructor(
        public id : string,
        public accion: string,
        public titulo_articulo: string,
        public responsable: string,
        public fecha: Date,
        public proyecto_id: string,
        public usuario_id: string | null,
        public articulo_id: string | null,
    ){}
}