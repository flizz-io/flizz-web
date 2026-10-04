-- CreateEnum
CREATE TYPE "publish_status" AS ENUM ('DRAFT', 'PUBLISHED');

-- CreateEnum
CREATE TYPE "article_category" AS ENUM ('ENGINEERING', 'PRODUCT', 'AI', 'PRACTICE');

-- CreateEnum
CREATE TYPE "contact_scope" AS ENUM ('NEW_BUILD', 'REBUILD', 'SCALE', 'FIX', 'UNDECIDED');

-- CreateEnum
CREATE TYPE "contact_start" AS ENUM ('IMMEDIATELY', 'THIS_QUARTER', 'NEXT_QUARTER', 'EXPLORING');

-- CreateEnum
CREATE TYPE "contact_message_status" AS ENUM ('NEW', 'READ', 'REPLIED', 'ARCHIVED', 'SPAM');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "media_purpose" ADD VALUE 'ARTICLE_COVER';
ALTER TYPE "media_purpose" ADD VALUE 'ARTICLE_IMAGE';

-- AlterTable
ALTER TABLE "projects" ADD COLUMN     "service_id" INTEGER;

-- CreateTable
CREATE TABLE "articles" (
    "id" SERIAL NOT NULL,
    "uuid" UUID NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "excerpt" TEXT NOT NULL,
    "category" "article_category" NOT NULL,
    "tags" TEXT[],
    "body" JSONB NOT NULL,
    "cover_image_id" INTEGER,
    "author_id" INTEGER,
    "status" "publish_status" NOT NULL DEFAULT 'DRAFT',
    "publish_at" TIMESTAMPTZ(3),
    "first_published_at" TIMESTAMPTZ(3),
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,
    "deleted_at" TIMESTAMPTZ(3),
    "created_by_id" INTEGER,
    "updated_by_id" INTEGER,
    "deleted_by_id" INTEGER,

    CONSTRAINT "articles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "services" (
    "id" SERIAL NOT NULL,
    "uuid" UUID NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "category" "service_category" NOT NULL,
    "summary" TEXT NOT NULL,
    "visual_kind" TEXT NOT NULL,
    "intro" TEXT NOT NULL,
    "problem" TEXT NOT NULL,
    "deliverables" TEXT[],
    "outcomes" TEXT[],
    "engagement" TEXT,
    "display_order" INTEGER NOT NULL DEFAULT 0,
    "status" "publish_status" NOT NULL DEFAULT 'DRAFT',
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,
    "deleted_at" TIMESTAMPTZ(3),
    "created_by_id" INTEGER,
    "updated_by_id" INTEGER,
    "deleted_by_id" INTEGER,

    CONSTRAINT "services_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "testimonials" (
    "id" SERIAL NOT NULL,
    "uuid" UUID NOT NULL,
    "quote" TEXT NOT NULL,
    "highlights" TEXT[],
    "author_name" TEXT NOT NULL,
    "author_role" TEXT NOT NULL,
    "project_id" INTEGER,
    "display_order" INTEGER NOT NULL DEFAULT 0,
    "status" "publish_status" NOT NULL DEFAULT 'DRAFT',
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,
    "deleted_at" TIMESTAMPTZ(3),
    "created_by_id" INTEGER,
    "updated_by_id" INTEGER,
    "deleted_by_id" INTEGER,

    CONSTRAINT "testimonials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contact_messages" (
    "id" SERIAL NOT NULL,
    "uuid" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "company" TEXT,
    "email" TEXT NOT NULL,
    "scope" "contact_scope" NOT NULL,
    "start" "contact_start" NOT NULL,
    "message" TEXT NOT NULL,
    "status" "contact_message_status" NOT NULL DEFAULT 'NEW',
    "read_at" TIMESTAMPTZ(3),
    "read_by_id" INTEGER,
    "internal_note" TEXT,
    "source_path" TEXT,
    "ip_hash" TEXT,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,
    "deleted_at" TIMESTAMPTZ(3),
    "updated_by_id" INTEGER,
    "deleted_by_id" INTEGER,

    CONSTRAINT "contact_messages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "articles_uuid_key" ON "articles"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "articles_slug_key" ON "articles"("slug");

-- CreateIndex
CREATE INDEX "articles_status_deleted_at_idx" ON "articles"("status", "deleted_at");

-- CreateIndex
CREATE INDEX "articles_category_idx" ON "articles"("category");

-- CreateIndex
CREATE INDEX "articles_tags_idx" ON "articles" USING GIN ("tags");

-- CreateIndex
CREATE INDEX "articles_author_id_idx" ON "articles"("author_id");

-- CreateIndex
CREATE UNIQUE INDEX "services_uuid_key" ON "services"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "services_slug_key" ON "services"("slug");

-- CreateIndex
CREATE INDEX "services_status_deleted_at_idx" ON "services"("status", "deleted_at");

-- CreateIndex
CREATE INDEX "services_category_display_order_idx" ON "services"("category", "display_order");

-- CreateIndex
CREATE UNIQUE INDEX "testimonials_uuid_key" ON "testimonials"("uuid");

-- CreateIndex
CREATE INDEX "testimonials_status_deleted_at_display_order_idx" ON "testimonials"("status", "deleted_at", "display_order");

-- CreateIndex
CREATE UNIQUE INDEX "contact_messages_uuid_key" ON "contact_messages"("uuid");

-- CreateIndex
CREATE INDEX "contact_messages_status_deleted_at_created_at_idx" ON "contact_messages"("status", "deleted_at", "created_at");

-- CreateIndex
CREATE INDEX "contact_messages_email_idx" ON "contact_messages"("email");

-- CreateIndex
CREATE INDEX "projects_service_id_idx" ON "projects"("service_id");

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "services"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "articles" ADD CONSTRAINT "articles_cover_image_id_fkey" FOREIGN KEY ("cover_image_id") REFERENCES "media_files"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "articles" ADD CONSTRAINT "articles_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "articles" ADD CONSTRAINT "articles_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "articles" ADD CONSTRAINT "articles_updated_by_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "articles" ADD CONSTRAINT "articles_deleted_by_id_fkey" FOREIGN KEY ("deleted_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "services" ADD CONSTRAINT "services_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "services" ADD CONSTRAINT "services_updated_by_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "services" ADD CONSTRAINT "services_deleted_by_id_fkey" FOREIGN KEY ("deleted_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "testimonials" ADD CONSTRAINT "testimonials_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "testimonials" ADD CONSTRAINT "testimonials_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "testimonials" ADD CONSTRAINT "testimonials_updated_by_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "testimonials" ADD CONSTRAINT "testimonials_deleted_by_id_fkey" FOREIGN KEY ("deleted_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contact_messages" ADD CONSTRAINT "contact_messages_read_by_id_fkey" FOREIGN KEY ("read_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contact_messages" ADD CONSTRAINT "contact_messages_updated_by_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contact_messages" ADD CONSTRAINT "contact_messages_deleted_by_id_fkey" FOREIGN KEY ("deleted_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
