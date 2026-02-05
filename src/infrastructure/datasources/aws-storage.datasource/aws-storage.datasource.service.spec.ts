import { Test, TestingModule } from '@nestjs/testing';
import { AwsStorageDatasourceService } from './aws-storage.datasource.service';

describe('AwsStorageDatasourceService', () => {
  let service: AwsStorageDatasourceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AwsStorageDatasourceService],
    }).compile();

    service = module.get<AwsStorageDatasourceService>(AwsStorageDatasourceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
