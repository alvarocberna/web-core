import { Test, TestingModule } from '@nestjs/testing';
import { LocalStorageDatasourceService } from './local-storage.datasource.service';

describe('LocalStorageDatasourceService', () => {
  let service: LocalStorageDatasourceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LocalStorageDatasourceService],
    }).compile();

    service = module.get<LocalStorageDatasourceService>(LocalStorageDatasourceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
