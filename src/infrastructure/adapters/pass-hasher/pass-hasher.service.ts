import { Injectable } from '@nestjs/common';
import bcrypt from "bcryptjs";

@Injectable()
export class PassHasherService {
    
    async hash(pass: string): Promise<string> {
        /*
        Salt representa una cadena aleatoria añadida a la contraseña antes de encriptarla
        El parámetro 10 indica el número de rondas de procesamiento o cost factor, mientras más
        alto el número más seguro pero más pesado computacionalmente
        */
        const salt = await bcrypt.genSalt(10); 
        //se toma la contraseña + el salt generado, se comina y se hashea
        const hashedPassword = await bcrypt.hash(pass, salt);
        return hashedPassword;
    }

    async compare(inputPass: string, dbPass: string): Promise<boolean>{
        return await bcrypt.compare(inputPass, dbPass);
    }
}
