import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';
import { FileFilterCallback } from 'multer';

@Injectable()
export class ImageStorageService {
    private uploadDir: string;
    private baseUrl: string;

    constructor(private configService: ConfigService) {
        this.uploadDir = path.join(process.cwd(), 'uploads', 'images');
        this.baseUrl = this.configService.get('BASE_URL') || 'http://localhost:3000';
        
        // Crear directorio si no existe
        if (!fs.existsSync(this.uploadDir)) {
            fs.mkdirSync(this.uploadDir, { recursive: true });
        }
    }

    saveImage(file: any): string {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        const ext = path.extname(file.originalname);
        const filename = `image-${uniqueSuffix}${ext}`;
        const filePath = path.join(this.uploadDir, filename);
        
        fs.writeFileSync(filePath, file.buffer);
        
        return `${this.baseUrl}/uploads/images/${filename}`;
    }

    deleteImage(imageUrl: string): void {
        if (!imageUrl || !imageUrl.includes('/uploads/images/')) return;
        
        const filename = path.basename(imageUrl);
        const filePath = path.join(this.uploadDir, filename);
        
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    }
}
