/*
  Warnings:

  - You are about to drop the column `proyecto_id` on the `Actividad` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Actividad" DROP COLUMN "proyecto_id",
ADD COLUMN     "usuario_id" TEXT;

-- AlterTable
ALTER TABLE "public"."Usuario" ADD COLUMN     "actividad_id" TEXT;

-- AddForeignKey
ALTER TABLE "public"."Actividad" ADD CONSTRAINT "Actividad_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "public"."Usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;
