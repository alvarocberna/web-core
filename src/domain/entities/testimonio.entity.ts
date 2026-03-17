export class TestimonioEntity {
    constructor(
        public id: string,
        public nombre: string,
        public apellido: string,
        public correo: string,
        public descripcion: string,
        public calificacion: number | null,
        public aprobado: boolean,
        public fecha_creacion: Date,
        public testimonios_id: string,
    ) {}
}
