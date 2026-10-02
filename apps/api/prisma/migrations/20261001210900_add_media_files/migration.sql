/*
  Warnings:

  - You are about to drop the column `photo_url` on the `users` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "media_purpose" AS ENUM ('AVATAR');

-- AlterTable
ALTER TABLE "users" DROP COLUMN "photo_url",
ADD COLUMN     "photo_id" INTEGER;

-- CreateTable
CREATE TABLE "media_files" (
    "id" SERIAL NOT NULL,
    "uuid" UUID NOT NULL,
    "purpose" "media_purpose" NOT NULL,
    "provider" TEXT NOT NULL,
    "storage_key" TEXT NOT NULL,
    "mime_type" TEXT NOT NULL,
    "size_bytes" INTEGER NOT NULL,
    "width" INTEGER,
    "height" INTEGER,
    "original_name" TEXT,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,
    "deleted_at" TIMESTAMPTZ(3),
    "created_by_id" INTEGER,
    "updated_by_id" INTEGER,
    "deleted_by_id" INTEGER,

    CONSTRAINT "media_files_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "media_files_uuid_key" ON "media_files"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "media_files_storage_key_key" ON "media_files"("storage_key");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_photo_id_fkey" FOREIGN KEY ("photo_id") REFERENCES "media_files"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "media_files" ADD CONSTRAINT "media_files_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "media_files" ADD CONSTRAINT "media_files_updated_by_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "media_files" ADD CONSTRAINT "media_files_deleted_by_id_fkey" FOREIGN KEY ("deleted_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
