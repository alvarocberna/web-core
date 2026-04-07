export class ServiciosEntity {
    constructor(
        public id: string,
        public titulo: string,
        public descripcion: string | null,
        public icono: string | null,
        public activo: boolean,
        public notificacion: boolean,
        public habilitado: boolean,
        public proyecto_id: string,
    ) {}
}
