

export abstract class CreateUsuarioDto{
    abstract nombre: string;
    abstract apellido: string;
    abstract email: string;
    abstract password: string;
    abstract rol: string;
    abstract img_url: string | null;
    abstract img_alt: string | null;
}

//dto para actualizar info como ADMIN: modifica otros usuarios
export abstract class UpdateUsuarioDto{
    abstract nombre?: string;
    abstract apellido?: string;
    abstract email?: string;
    abstract rol?: string;
    abstract img_url?: string;
    abstract img_alt?: string;
}

//ESTO SE TIENE QUE ELIMINAR - dto para actualizar info usuario como USER
export abstract class UpdateUsuarioInfoDto{
    abstract nombre?: string;
    abstract apellido?: string;
    abstract email?: string;
    abstract img_url: string | null;
    abstract img_alt: string | null;
}

export abstract class UpdateUsuarioPasswordDto{
    abstract currentPassword: string;
    abstract newPassword: string;
}