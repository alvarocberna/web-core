import { Test, TestingModule } from '@nestjs/testing';
import { SecArticuloDatasourceService } from './sec-articulo.datasource.service';

describe('ArticuloDatasourceService', () => {
  let service: SecArticuloDatasourceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SecArticuloDatasourceService],
    }).compile();

    service = module.get<SecArticuloDatasourceService>(SecArticuloDatasourceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
