/*
  Warnings:

  - You are about to drop the column `image` on the `SecArticulo` table. All the data in the column will be lost.
  - Added the required column `titulo_articulo` to the `Actividad` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Actividad" ADD COLUMN     "titulo_articulo" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."Articulo" ADD COLUMN     "image_alt" TEXT,
ADD COLUMN     "image_position" TEXT,
ADD COLUMN     "image_url" TEXT;

-- AlterTable
ALTER TABLE "public"."SecArticulo" DROP COLUMN "image",
ADD COLUMN     "image_alt" TEXT,
ADD COLUMN     "image_position" TEXT,
ADD COLUMN     "image_url" TEXT;
