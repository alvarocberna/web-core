import { Test, TestingModule } from '@nestjs/testing';
import { UsuarioRepositoryService } from './usuario.repository.service';

describe('UsuarioRepositoryService', () => {
  let service: UsuarioRepositoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsuarioRepositoryService],
    }).compile();

    service = module.get<UsuarioRepositoryService>(UsuarioRepositoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
