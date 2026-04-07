import { BadRequestException } from '@nestjs/common';

const ALLOWED_MIMETYPES = ['image/jpeg', 'image/png'];
const ALLOWED_EXTENSIONS = /\.(jpg|jpeg|png)$/i;

export const imageMulterOptions = {
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
    },
    fileFilter: (
        _req: Express.Request,
        file: Express.Multer.File,
        cb: (error: Error | null, acceptFile: boolean) => void,
    ) => {
        // Permitir blobs vacíos/placeholders (sin nombre o nombre genérico sin extensión)
        // que el frontend envía para mantener alineación de índices con sec_articulo.
        // El service los descarta por tamaño 0.
        const isEmptyPlaceholder =
            !file.originalname ||
            file.originalname === 'blob' ||
            (file.mimetype === 'application/octet-stream' && !ALLOWED_EXTENSIONS.test(file.originalname));

        if (isEmptyPlaceholder) {
            return cb(null, true);
        }

        if (!ALLOWED_MIMETYPES.includes(file.mimetype) || !ALLOWED_EXTENSIONS.test(file.originalname)) {
            return cb(
                new BadRequestException('Solo se permiten imágenes JPG o PNG'),
                false,
            );
        }
        cb(null, true);
    },
};
