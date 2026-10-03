-- CreateEnum
CREATE TYPE "slug_entity_type" AS ENUM ('SERVICE', 'PROJECT', 'ARTICLE');

-- AlterEnum
ALTER TYPE "media_purpose" ADD VALUE 'SERVICE_OG_IMAGE';

-- AlterTable
ALTER TABLE "services" ADD COLUMN     "faqs" JSONB NOT NULL DEFAULT '[]',
ADD COLUMN     "og_image_id" INTEGER,
ADD COLUMN     "seo_description" TEXT,
ADD COLUMN     "seo_title" TEXT;

-- CreateTable
CREATE TABLE "slug_redirects" (
    "id" SERIAL NOT NULL,
    "uuid" UUID NOT NULL,
    "entity_type" "slug_entity_type" NOT NULL,
    "old_slug" TEXT NOT NULL,
    "entity_id" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,
    "deleted_at" TIMESTAMPTZ(3),
    "created_by_id" INTEGER,
    "updated_by_id" INTEGER,
    "deleted_by_id" INTEGER,

    CONSTRAINT "slug_redirects_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "slug_redirects_uuid_key" ON "slug_redirects"("uuid");

-- CreateIndex
CREATE INDEX "slug_redirects_entity_type_entity_id_idx" ON "slug_redirects"("entity_type", "entity_id");

-- CreateIndex
CREATE UNIQUE INDEX "slug_redirects_entity_type_old_slug_key" ON "slug_redirects"("entity_type", "old_slug");

-- AddForeignKey
ALTER TABLE "services" ADD CONSTRAINT "services_og_image_id_fkey" FOREIGN KEY ("og_image_id") REFERENCES "media_files"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "slug_redirects" ADD CONSTRAINT "slug_redirects_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "slug_redirects" ADD CONSTRAINT "slug_redirects_updated_by_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "slug_redirects" ADD CONSTRAINT "slug_redirects_deleted_by_id_fkey" FOREIGN KEY ("deleted_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
