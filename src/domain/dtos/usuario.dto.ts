export abstract class CreateUsuarioDto {
  abstract nombre: string;
  abstract apellido: string;
  abstract email: string;
  abstract password: string;
  abstract rol: string;
  abstract imgUrl: string | null;
  abstract imgAlt: string | null;
}

//dto para actualizar info como ADMIN: modifica otros usuarios
export abstract class UpdateUsuarioDto {
  abstract nombre?: string;
  abstract apellido?: string;
  abstract email?: string;
  abstract rol?: string;
  abstract imgUrl?: string;
  abstract imgAlt?: string;
}

//ESTO SE TIENE QUE ELIMINAR - dto para actualizar info usuario como USER
export abstract class UpdateUsuarioInfoDto {
  abstract nombre?: string;
  abstract apellido?: string;
  abstract email?: string;
  abstract imgUrl: string | null;
  abstract imgAlt: string | null;
}

export abstract class UpdateUsuarioPasswordDto {
  abstract currentPassword: string;
  abstract newPassword: string;
}
