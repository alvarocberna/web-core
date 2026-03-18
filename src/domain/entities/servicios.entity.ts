export class ServiciosEntity {
    constructor(
        public id: string,
        public titulo: string,
        public descripcion: string | null,
        public icono: string | null,
        public activo: string,
        public proyecto_id: string,
    ) {}
}
