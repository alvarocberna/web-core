import { ActividadService } from './actividad.service';
import type { ActividadRepositoryService } from 'src/infrastructure';
import { ActividadEntity } from 'src/domain';

describe('ActividadService', () => {
  let service: ActividadService;
  let mockActividadRepository: jest.Mocked<ActividadRepositoryService>;

  beforeEach(() => {
    mockActividadRepository = {
      createActividad: jest.fn(),
      getActividadById: jest.fn(),
      getActividadByArticulo: jest.fn(),
      getActividadAll: jest.fn(),
      deleteActividad: jest.fn(),
    } as any;

    service = new ActividadService(mockActividadRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('findAll should delegate to the repository', async () => {
    const mockActividades = [{ id: 'actividad-1' }] as ActividadEntity[];
    mockActividadRepository.getActividadAll.mockResolvedValue(mockActividades);

    const result = await service.findAll('usuario-123');

    expect(mockActividadRepository.getActividadAll).toHaveBeenCalledWith('usuario-123');
    expect(result).toBe(mockActividades);
  });

  // Los siguientes métodos aún no están implementados (placeholders del CLI de Nest);
  // estos tests documentan el comportamiento actual para detectar cuando se implementen.
  it('findOneByArticuloId is not implemented yet and returns a placeholder string', () => {
    expect(service.findOneByArticuloId(1)).toBe('This action returns a #1 actividad');
  });

  it('findOneById is not implemented yet and returns a placeholder string', () => {
    expect(service.findOneById(1)).toBe('This action returns a #1 actividad');
  });

  it('remove is not implemented yet and returns a placeholder string', () => {
    expect(service.remove(1)).toBe('This action removes a #1 actividad');
  });
});
