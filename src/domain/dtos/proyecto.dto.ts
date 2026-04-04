
export abstract class CreateProyectoDto {
    abstract nombre_proyecto: string;
    abstract descripcion: string;
    abstract cliente: string;
    abstract activo: boolean;
    abstract equipo_habilitado: boolean;
    abstract servicios_habilitado: boolean;
    abstract articulos_habilitado: boolean;
    abstract testimonios_habilitado: boolean;
    abstract nombre: string;
    abstract apellido: string;
    abstract email: string;
    abstract password: string;
    abstract rol: string;
}

export abstract class UpdateProyectoDto {
    abstract nombre_proyecto: string;
    abstract descripcion: string;
    abstract cliente: string;
    abstract activo: boolean;
}