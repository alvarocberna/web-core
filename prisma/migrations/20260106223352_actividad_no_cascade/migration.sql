-- DropForeignKey
ALTER TABLE "public"."Actividad" DROP CONSTRAINT "Actividad_articulo_id_fkey";

-- AlterTable
ALTER TABLE "public"."Actividad" ALTER COLUMN "articulo_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."Actividad" ADD CONSTRAINT "Actividad_articulo_id_fkey" FOREIGN KEY ("articulo_id") REFERENCES "public"."Articulo"("id") ON DELETE SET NULL ON UPDATE CASCADE;
