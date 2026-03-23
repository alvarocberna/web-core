export class TestimoniosEntity {
    constructor(
        public id: string,
        public titulo: string,
        public descripcion: string | null,
        public activo: boolean,
        public aprobar: boolean,
        public notificacion: boolean,
        public habilitado: boolean,
        public proyecto_id: string,
    ) {}
}
