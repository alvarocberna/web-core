-- DropIndex
DROP INDEX "public"."Articulo_slug_key";

-- AlterTable
ALTER TABLE "public"."SecArticulo" ALTER COLUMN "image" SET DATA TYPE TEXT;
