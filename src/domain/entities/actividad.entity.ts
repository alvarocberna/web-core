
export class ActividadEntity{
    constructor(
        public id : string,
        public accion: string,
        public responsable: string,
        public fecha: Date,
        public proyecto_id: string,
        public articulo_id: string | null,
    ){}
}