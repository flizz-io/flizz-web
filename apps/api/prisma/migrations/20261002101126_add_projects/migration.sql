-- CreateEnum
CREATE TYPE "project_sector" AS ENUM ('OPERATIONS', 'RETAIL', 'FIELD', 'FINANCE', 'PROFESSIONAL');

-- CreateEnum
CREATE TYPE "service_category" AS ENUM ('CUSTOM_SOFTWARE', 'AI_AUTOMATION', 'ECOMMERCE', 'MOBILE');

-- CreateEnum
CREATE TYPE "project_status" AS ENUM ('DRAFT', 'PUBLISHED');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "media_purpose" ADD VALUE 'PROJECT_COVER';
ALTER TYPE "media_purpose" ADD VALUE 'PROJECT_GALLERY';

-- CreateTable
CREATE TABLE "projects" (
    "id" SERIAL NOT NULL,
    "uuid" UUID NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "client" TEXT NOT NULL,
    "sector" "project_sector" NOT NULL,
    "service_category" "service_category" NOT NULL,
    "service_slug" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "summary" TEXT NOT NULL,
    "results" JSONB NOT NULL,
    "duration" TEXT NOT NULL,
    "team" TEXT NOT NULL,
    "brief" TEXT[],
    "constraints" TEXT[],
    "approach" TEXT[],
    "built" TEXT[],
    "stack" TEXT[],
    "quote_text" TEXT,
    "quote_attribution" TEXT,
    "cover_image_id" INTEGER,
    "status" "project_status" NOT NULL DEFAULT 'DRAFT',
    "publish_at" TIMESTAMPTZ(3),
    "first_published_at" TIMESTAMPTZ(3),
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "featured_order" INTEGER NOT NULL DEFAULT 0,
    "show_on_home" BOOLEAN NOT NULL DEFAULT false,
    "home_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,
    "deleted_at" TIMESTAMPTZ(3),
    "created_by_id" INTEGER,
    "updated_by_id" INTEGER,
    "deleted_by_id" INTEGER,

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_images" (
    "id" SERIAL NOT NULL,
    "uuid" UUID NOT NULL,
    "project_id" INTEGER NOT NULL,
    "media_id" INTEGER NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,
    "caption" TEXT,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,
    "deleted_at" TIMESTAMPTZ(3),
    "created_by_id" INTEGER,
    "updated_by_id" INTEGER,
    "deleted_by_id" INTEGER,

    CONSTRAINT "project_images_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "projects_uuid_key" ON "projects"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "projects_slug_key" ON "projects"("slug");

-- CreateIndex
CREATE INDEX "projects_status_deleted_at_idx" ON "projects"("status", "deleted_at");

-- CreateIndex
CREATE INDEX "projects_featured_idx" ON "projects"("featured");

-- CreateIndex
CREATE INDEX "projects_show_on_home_idx" ON "projects"("show_on_home");

-- CreateIndex
CREATE UNIQUE INDEX "project_images_uuid_key" ON "project_images"("uuid");

-- CreateIndex
CREATE INDEX "project_images_project_id_deleted_at_idx" ON "project_images"("project_id", "deleted_at");

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_cover_image_id_fkey" FOREIGN KEY ("cover_image_id") REFERENCES "media_files"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_updated_by_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_deleted_by_id_fkey" FOREIGN KEY ("deleted_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_images" ADD CONSTRAINT "project_images_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_images" ADD CONSTRAINT "project_images_media_id_fkey" FOREIGN KEY ("media_id") REFERENCES "media_files"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_images" ADD CONSTRAINT "project_images_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_images" ADD CONSTRAINT "project_images_updated_by_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_images" ADD CONSTRAINT "project_images_deleted_by_id_fkey" FOREIGN KEY ("deleted_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
