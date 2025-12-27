import { Test, TestingModule } from '@nestjs/testing';
import { ProyectoDatasourceService } from './proyecto.datasource.service';

describe('ProyectoDatasourceService', () => {
  let service: ProyectoDatasourceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProyectoDatasourceService],
    }).compile();

    service = module.get<ProyectoDatasourceService>(ProyectoDatasourceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
