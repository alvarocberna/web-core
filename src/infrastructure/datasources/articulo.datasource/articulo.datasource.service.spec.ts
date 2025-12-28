import { Test, TestingModule } from '@nestjs/testing';
import { ArticuloDatasourceService } from './articulo.datasource.service';

describe('ArticuloDatasourceService', () => {
  let service: ArticuloDatasourceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ArticuloDatasourceService],
    }).compile();

    service = module.get<ArticuloDatasourceService>(ArticuloDatasourceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
