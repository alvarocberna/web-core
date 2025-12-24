
export abstract class CreateProyectoDto {
    abstract nombre_proyecto: string;
    abstract descripcion: string;
    abstract cliente: string;
}

export abstract class UpdateProyectoDto {
    abstract nombre_proyecto: string;
    abstract descripcion: string;
    abstract cliente: string;
}