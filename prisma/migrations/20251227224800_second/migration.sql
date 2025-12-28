-- DropForeignKey
ALTER TABLE "public"."Articulo" DROP CONSTRAINT "Articulo_autor_id_fkey";

-- AddForeignKey
ALTER TABLE "public"."Articulo" ADD CONSTRAINT "Articulo_proyecto_id_fkey" FOREIGN KEY ("proyecto_id") REFERENCES "public"."Proyecto"("id") ON DELETE CASCADE ON UPDATE CASCADE;
