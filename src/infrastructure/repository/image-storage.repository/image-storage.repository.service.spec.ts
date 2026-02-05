import { Test, TestingModule } from '@nestjs/testing';
import { ImageStorageRepositoryService } from './image-storage.repository.service';

describe('ImageStorageRepositoryService', () => {
  let service: ImageStorageRepositoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ImageStorageRepositoryService],
    }).compile();

    service = module.get<ImageStorageRepositoryService>(ImageStorageRepositoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
