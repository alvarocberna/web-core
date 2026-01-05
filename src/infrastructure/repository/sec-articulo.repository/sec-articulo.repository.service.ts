import { Injectable } from '@nestjs/common';
//domain
import { SecArticuloRepository, CreateSecArticuloDto, UpdateSecArticuloDto, SecArticuloEntity } from 'src/domain';
//infrastructure
import { SecArticuloDatasourceService } from 'src/infrastructure';

@Injectable()
export class SecArticuloRepositoryService {
    constructor(private readonly secArticuloDatasource: SecArticuloDatasourceService){}

      async createSecArticulo(id_usuario: string, id_articulo: string, createSecArticuloDto: CreateSecArticuloDto[]): Promise<SecArticuloEntity[]> {
            return this.secArticuloDatasource.createSecArticulo(id_usuario, id_articulo, createSecArticuloDto)
        }
    
        async getSecArticuloById(id_proyecto: string, id_articulo: string, id_sec_articulo: string): Promise<SecArticuloEntity | null> {
            return this.secArticuloDatasource.getSecArticuloById(id_proyecto, id_articulo, id_sec_articulo)
        }
    
        async getAllSecArticulos(id_proyecto: string, id_articulo: string): Promise<SecArticuloEntity[]> {
            return this.secArticuloDatasource.getAllSecArticulos(id_proyecto, id_articulo)
        }
    
        async updateSecArticulo(id_proyecto: string, id_articulo: string, id_sec_articulo: string,  updateSecArticuloDto: UpdateSecArticuloDto): Promise<SecArticuloEntity> {
            return this.secArticuloDatasource.updateSecArticulo(id_proyecto, id_articulo, id_sec_articulo, updateSecArticuloDto)
        }
        
        async deleteSecArticulo(id_proyecto: string, id_articulo: string, id_sec_articulo: string): Promise<void> {
            await this.secArticuloDatasource.deleteSecArticulo(id_proyecto, id_articulo, id_sec_articulo)
        }
    
}
