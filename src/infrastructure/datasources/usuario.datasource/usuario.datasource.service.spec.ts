import { Test, TestingModule } from '@nestjs/testing';
import { UsuarioDatasourceService } from './usuario.datasource.service';

describe('UsuarioDatasourceService', () => {
  let service: UsuarioDatasourceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsuarioDatasourceService],
    }).compile();

    service = module.get<UsuarioDatasourceService>(UsuarioDatasourceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
