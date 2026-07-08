import { TestimoniosService } from './testimonios.service';
import type { TestimoniosRepositoryService } from 'src/infrastructure';

describe('TestimoniosService', () => {
  let service: TestimoniosService;
  let mockTestimoniosRepository: jest.Mocked<TestimoniosRepositoryService>;

  beforeEach(() => {
    mockTestimoniosRepository = {
      createSecTestimonios: jest.fn(),
      getSecTestimonios: jest.fn(),
      updateSecTestimonios: jest.fn(),
      createTestimonio: jest.fn(),
      updateTestimonio: jest.fn(),
      deleteTestimonio: jest.fn(),
      getSecTestimoniosPublic: jest.fn(),
      createTestimonioPublic: jest.fn(),
    } as any;

    service = new TestimoniosService(mockTestimoniosRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('create should delegate to the repository', () => {
    const dto = {} as any;
    service.create('usuario-123', dto);
    expect(mockTestimoniosRepository.createSecTestimonios).toHaveBeenCalledWith('usuario-123', dto);
  });

  it('find should delegate to the repository', () => {
    service.find('usuario-123');
    expect(mockTestimoniosRepository.getSecTestimonios).toHaveBeenCalledWith('usuario-123');
  });

  it('update should delegate to the repository', () => {
    const dto = {} as any;
    service.update('usuario-123', dto);
    expect(mockTestimoniosRepository.updateSecTestimonios).toHaveBeenCalledWith('usuario-123', dto);
  });

  it('createTestimonio should delegate to the repository', () => {
    const dto = {} as any;
    service.createTestimonio('usuario-123', dto);
    expect(mockTestimoniosRepository.createTestimonio).toHaveBeenCalledWith('usuario-123', dto);
  });

  it('updateTestimonio should delegate to the repository', () => {
    const dto = {} as any;
    service.updateTestimonio('testimonio-1', dto);
    expect(mockTestimoniosRepository.updateTestimonio).toHaveBeenCalledWith('testimonio-1', dto);
  });

  it('removeTestimonio should delegate to the repository', () => {
    service.removeTestimonio('usuario-123', 'testimonio-1');
    expect(mockTestimoniosRepository.deleteTestimonio).toHaveBeenCalledWith('usuario-123', 'testimonio-1');
  });

  it('findTestimoniosPublic should delegate to the repository', () => {
    service.findTestimoniosPublic('proyecto-123');
    expect(mockTestimoniosRepository.getSecTestimoniosPublic).toHaveBeenCalledWith('proyecto-123');
  });

  it('createTestimonioPublic should delegate to the repository', () => {
    const dto = {} as any;
    service.createTestimonioPublic('proyecto-123', dto);
    expect(mockTestimoniosRepository.createTestimonioPublic).toHaveBeenCalledWith('proyecto-123', dto);
  });
});
