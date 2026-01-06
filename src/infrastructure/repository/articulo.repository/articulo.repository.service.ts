//nest
import { Injectable } from '@nestjs/common';
//domain
import { ArticuloRepository, CreateArticuloDto, UpdateArticuloDto, ArticuloEntity } from 'src/domain';
//infrastructure
import { ArticuloDatasourceService } from 'src/infrastructure';

@Injectable()
export class ArticuloRepositoryService implements ArticuloRepository {
    constructor(private readonly articuloDatasource: ArticuloDatasourceService){}

       async createArticulo(id_usuario: string, createArticuloDto: CreateArticuloDto): Promise<ArticuloEntity> {
            return this.articuloDatasource.createArticulo(id_usuario, createArticuloDto)
        }
    
        async getArticuloById(id_usuario: string, id_articulo: string): Promise<ArticuloEntity | null> {
            return this.articuloDatasource.getArticuloById(id_usuario, id_articulo)
        }
    
        async getAllArticulos(id_usuario: string): Promise<ArticuloEntity[]> {
            return this.articuloDatasource.getAllArticulos(id_usuario)
        }
    
        async updateArticulo(id_usuario: string, id_articulo: string, updateArticuloDto: UpdateArticuloDto): Promise<ArticuloEntity> {
            return this.articuloDatasource.updateArticulo(id_usuario, id_articulo, updateArticuloDto)
        }

        async deleteArticulo(id_usuario: string, id_articulo: string): Promise<void> {
            await this.articuloDatasource.deleteArticulo(id_usuario, id_articulo)
        }
}
