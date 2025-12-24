

export abstract class CreateUsuarioDto{
    abstract nombre: string;
    abstract apellido: string;
    abstract email: string;
    abstract password: string;
    abstract rol: string;
}

export abstract class UpdateUsuarioDto{
    abstract nombre: string;
    abstract apellido: string;
    abstract email: string;
    abstract password: string;
    abstract rol: string;
}