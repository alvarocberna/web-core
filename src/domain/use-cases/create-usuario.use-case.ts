// //domain
// import { UsuarioEntity } from "../entities/usuario.entity";
// import { UsuarioRepository } from "../repository/usuario.repository";
// import { CreatePacienteDto } from "@/";

// interface CreatePacienteUseCaseInterface{
//     execute(id_prof: string, data: CreatePacienteDto): Promise<UsuarioEntity>
// }

// export class CreatePacienteUseCase implements CreatePacienteUseCaseInterface{

//     constructor( 
//         private readonly usuarioRepository: UsuarioRepository,
//     ){ }

//     public async execute(id_prof: string, createPacienteDto: CreatePacienteDto): Promise<UsuarioEntity> {

//         const id_profesional = id_prof;

//         const paciente = this.usuarioRepository.createPaciente(createPacienteDto);

//         const id_paciente = (await paciente).id;

//         this.relacionPacProRepository.createRelacion(id_paciente, id_profesional);
        
//         return paciente;

//     }

// }