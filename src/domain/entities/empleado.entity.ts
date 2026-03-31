export class EmpleadoEntity {
    constructor(
        public id: string,
        public nombre_primero: string,
        public nombre_segundo: string | null,
        public apellido_paterno: string,
        public apellido_materno: string | null,
        public profesion: string | null,
        public especialidad: string | null,
        public descripcion: string | null,
        public orden: number | null,
        public activo: boolean,
        public slug: string,
        public img_url: string | null,
        public img_alt: string | null,
        public equipo_id: string,
    ) {}
}
