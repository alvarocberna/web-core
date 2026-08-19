//ARTICULOS - ENTIDAD PADRE
export abstract class CreateArticulosDto {
  abstract titulo: string;
  abstract descripcion: string | null;
  abstract activo: boolean;
  abstract aprobar: boolean;
  abstract notificacion: boolean;
  abstract habilitado: boolean;
}

export abstract class UpdateArticulosDto {
  abstract titulo?: string;
  abstract descripcion?: string;
  abstract activo?: boolean;
  abstract aprobar?: boolean;
  abstract notificacion?: boolean;
  abstract habilitado?: boolean;
}

// export abstract class CreateArticuloFullDto{
//         articulo: CreateArticuloDto;
//         secArticulo: CreateSecArticuloDto[]
// }

//ARTICULO - ENTIDAD HIJA

export abstract class CreateArticuloDto {
  abstract titulo: string;
  abstract subtitulo: string | null;
  abstract autor: string;
  abstract fechaPublicacion: Date;
  abstract fechaActualizacion: Date | null;
  abstract status: string;
  abstract activo: boolean;
  abstract slug: string;
  abstract imageUrl: string | null;
  abstract imageAlt: string | null;
  abstract imagePosition: string | null;
  abstract secArticulo: CreateSecArticuloDto[];
}

export abstract class UpdateArticuloDto {
  abstract titulo?: string;
  abstract subtitulo?: string | null;
  abstract autor?: string;
  abstract fechaPublicacion?: Date;
  abstract fechaActualizacion?: Date | null;
  abstract status?: string;
  abstract activo?: boolean;
  abstract slug?: string;
  abstract imageUrl?: string | null;
  abstract imageAlt?: string | null;
  abstract imagePosition?: string | null;
  abstract secArticulo?: UpdateSecArticuloDto[];
}

//SEC-ARTICULO - ENTIDAD NIETA JAJ
export abstract class CreateSecArticuloDto {
  abstract nroSeccion: number;
  abstract tituloSec: string | null;
  abstract contenidoSec: string | null;
  abstract imageUrl: string | null;
  abstract imageAlt: string | null;
  abstract imagePosition: string | null;
}

export abstract class UpdateSecArticuloDto {
  abstract id: string;
  abstract nroSeccion?: number;
  abstract tituloSec?: string | null;
  abstract contenidoSec?: string | null;
  abstract imageUrl?: string | null;
  abstract imageAlt?: string | null;
  abstract imagePosition?: string | null;
}
