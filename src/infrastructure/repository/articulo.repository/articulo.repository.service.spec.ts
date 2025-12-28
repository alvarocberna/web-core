import { Test, TestingModule } from '@nestjs/testing';
import { ArticuloRepositoryService } from './articulo.repository.service';

describe('ArticuloRepositoryService', () => {
  let service: ArticuloRepositoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ArticuloRepositoryService],
    }).compile();

    service = module.get<ArticuloRepositoryService>(ArticuloRepositoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
