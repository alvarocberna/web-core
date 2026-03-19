export class EmpleadoEntity {
    constructor(
        public id: string,
        public nombre_primero: string,
        public nombre_segundo: string | null,
        public apellido_paterno: string,
        public apellido_materno: string | null,
        public profesion: string,
        public especialidad: string | null,
        public descripcion: string | null,
        public orden: number | null,
        public activo: boolean,
        public img_url: string,
        public img_alt: string,
        public slug: string | null,
        public equipo_id: string,
    ) {}
}
