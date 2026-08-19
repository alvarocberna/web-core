//SERVICIOS - ENTIDAD PADRE
export abstract class CreateServiciosDto {
  abstract titulo: string;
  abstract descripcion: string | null;
  abstract icono: string | null;
  abstract activo: boolean;
  abstract notificacion: boolean;
  abstract habilitado: boolean;
}

export abstract class UpdateServiciosDto {
  abstract titulo?: string;
  abstract descripcion?: string;
  abstract icono?: string;
  abstract activo?: boolean;
  abstract notificacion?: boolean;
  abstract habilitado?: boolean;
}

//SERVICIO - ENTIDAD HIJA
export abstract class CreateServicioDto {
  abstract nombreServicio: string;
  abstract descripcion: string | null;
  abstract valor: number | null;
  abstract nombrePromocion: string | null;
  abstract porcentajeDescuento: number | null;
  abstract destacado: boolean;
  abstract icono: string | null;
  abstract orden: number | null;
  abstract activo: boolean;
  abstract slug: string;
  abstract imgUrl: string | null;
  abstract imgAlt: string | null;
  abstract secServicio: CreateSecServicioDto[] | null;
}

export abstract class UpdateServicioOrdenDto {
  abstract id: string;
  abstract orden: number;
}

export abstract class UpdateServicioDto {
  abstract id: string;
  abstract nombreServicio: string;
  abstract descripcion: string | null;
  abstract valor: number | null;
  abstract nombrePromocion: string | null;
  abstract porcentajeDescuento: number | null;
  abstract destacado: boolean;
  abstract icono: string | null;
  abstract orden: number | null;
  abstract activo: boolean;
  abstract slug: string;
  abstract imgUrl: string | null;
  abstract imgAlt: string | null;
  abstract secServicio: UpdateSecServicioDto[] | null;
}

//SEC-SERVICIO - ENTIDAD NIETA JAJ
export abstract class CreateSecServicioDto {
  abstract nroSeccion: number;
  abstract tituloSec: string | null;
  abstract contenidoSec: string | null;
  abstract imageUrl: string | null;
  abstract imageAlt: string | null;
  abstract imagePosition: string | null;
}

export abstract class UpdateSecServicioDto {
  abstract id: string;
  abstract nroSeccion: number;
  abstract tituloSec: string | null;
  abstract contenidoSec: string | null;
  abstract imageUrl: string | null;
  abstract imageAlt: string | null;
  abstract imagePosition: string | null;
}
