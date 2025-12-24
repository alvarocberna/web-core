
export class Actividad{
    constructor(
        public id : string,
        public accion: string,
        public responsable: string,
        public articulo_relacionado: string,
        public fecha: Date,
        public articulo_id: string,
        public proyecto_id: string,
    ){}
}