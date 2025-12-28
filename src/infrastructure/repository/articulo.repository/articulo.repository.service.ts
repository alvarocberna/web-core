//nest
import { Injectable } from '@nestjs/common';
//domain
import { ArticuloRepository, CreateArticuloDto, UpdateArticuloDto, ArticuloEntity } from 'src/domain';
//infrastructure
import { ArticuloDatasourceService } from 'src/infrastructure';

@Injectable()
export class ArticuloRepositoryService implements ArticuloRepository {
    constructor(private readonly articuloDatasource: ArticuloDatasourceService){}

       async createArticulo(id_proyecto: string, createArticuloDto: CreateArticuloDto): Promise<ArticuloEntity> {
            return this.articuloDatasource.createArticulo(id_proyecto, createArticuloDto)
        }
    
        async getArticuloById(id_proyecto: string, id_articulo: string): Promise<ArticuloEntity | null> {
            return this.articuloDatasource.getArticuloById(id_proyecto, id_articulo)
        }
    
        async getAllArticulos(id_proyecto: string): Promise<ArticuloEntity[]> {
            return this.articuloDatasource.getAllArticulos(id_proyecto)
        }
    
        async updateArticulo(id_proyecto: string, id_articulo: string, updateArticuloDto: UpdateArticuloDto): Promise<ArticuloEntity> {
            return this.articuloDatasource.updateArticulo(id_proyecto, id_articulo, updateArticuloDto)
        }
        
        async deleteArticulo(id_proyecto: string, id_articulo: string): Promise<void> {
            await this.articuloDatasource.deleteArticulo(id_proyecto, id_articulo)
        }
}
