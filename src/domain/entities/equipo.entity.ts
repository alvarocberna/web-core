export class EquipoEntity {
    constructor(
        public id: string,
        public titulo: string,
        public descripcion: string | null,
        public activo: boolean,
        public proyecto_id: string,
    ) {}
}
