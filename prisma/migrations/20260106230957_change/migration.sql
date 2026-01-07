/*
  Warnings:

  - Added the required column `proyecto_id` to the `Actividad` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Actividad" ADD COLUMN     "proyecto_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."Actividad" ADD CONSTRAINT "Actividad_proyecto_id_fkey" FOREIGN KEY ("proyecto_id") REFERENCES "public"."Proyecto"("id") ON DELETE CASCADE ON UPDATE CASCADE;
