import { Test, TestingModule } from '@nestjs/testing';
import { SecArticuloRepositoryService } from './sec-articulo.repository.service';

describe('SecArticuloRepositoryService', () => {
  let service: SecArticuloRepositoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SecArticuloRepositoryService],
    }).compile();

    service = module.get<SecArticuloRepositoryService>(SecArticuloRepositoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
