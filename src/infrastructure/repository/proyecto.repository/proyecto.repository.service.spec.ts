import { Test, TestingModule } from '@nestjs/testing';
import { ProyectoRepositoryService } from './proyecto.repository.service';

describe('ProyectoRepositoryService', () => {
  let service: ProyectoRepositoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProyectoRepositoryService],
    }).compile();

    service = module.get<ProyectoRepositoryService>(ProyectoRepositoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
