-- CreateTable
CREATE TABLE "public"."Proyecto" (
    "id" TEXT NOT NULL,
    "nombre_proyecto" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "cliente" TEXT NOT NULL,
    "fecha_inicio" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Proyecto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Usuario" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "fechaCreacion" TIMESTAMP(3) NOT NULL,
    "password" TEXT NOT NULL,
    "hashedRt" TEXT,
    "rol" TEXT NOT NULL,
    "proyecto_id" TEXT NOT NULL,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Articulo" (
    "id" TEXT NOT NULL,
    "nro_articulo" INTEGER NOT NULL,
    "titulo" TEXT NOT NULL,
    "subtitulo" TEXT NOT NULL,
    "autor" TEXT NOT NULL,
    "fecha_publicacion" TIMESTAMP(3) NOT NULL,
    "fecha_actualizacion" TIMESTAMP(3),
    "status" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "autor_id" TEXT NOT NULL,
    "proyecto_id" TEXT NOT NULL,

    CONSTRAINT "Articulo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SecArticulo" (
    "id" TEXT NOT NULL,
    "nro_seccion" INTEGER NOT NULL,
    "titulo_sec" TEXT NOT NULL,
    "contenido_sec" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "articulo_id" TEXT NOT NULL,
    "proyecto_id" TEXT NOT NULL,

    CONSTRAINT "SecArticulo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Actividad" (
    "id" TEXT NOT NULL,
    "accion" TEXT NOT NULL,
    "responsable" TEXT NOT NULL,
    "articulo_relacionado" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "proyecto_id" TEXT NOT NULL,
    "articulo_id" TEXT NOT NULL,

    CONSTRAINT "Actividad_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "public"."Usuario"("email");

-- AddForeignKey
ALTER TABLE "public"."Usuario" ADD CONSTRAINT "Usuario_proyecto_id_fkey" FOREIGN KEY ("proyecto_id") REFERENCES "public"."Proyecto"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Articulo" ADD CONSTRAINT "Articulo_proyecto_id_fkey" FOREIGN KEY ("proyecto_id") REFERENCES "public"."Proyecto"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SecArticulo" ADD CONSTRAINT "SecArticulo_articulo_id_fkey" FOREIGN KEY ("articulo_id") REFERENCES "public"."Articulo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Actividad" ADD CONSTRAINT "Actividad_articulo_id_fkey" FOREIGN KEY ("articulo_id") REFERENCES "public"."Articulo"("id") ON DELETE CASCADE ON UPDATE CASCADE;
