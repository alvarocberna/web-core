import { Injectable } from '@nestjs/common';
import { ActividadRepositoryService } from 'src/infrastructure';

@Injectable()
export class ActividadService {
  constructor(
    private readonly actividadRepository: ActividadRepositoryService,
  ) {}

  findAll(usuarioId: string) {
    return this.actividadRepository.getActividadAll(usuarioId);
  }

  findOneByArticuloId(id: number) {
    return `This action returns a #${id} actividad`;
  }

  findOneById(id: number) {
    return `This action returns a #${id} actividad`;
  }

  remove(id: number) {
    return `This action removes a #${id} actividad`;
  }
}
