-- AlterEnum
ALTER TYPE "media_purpose" ADD VALUE 'ARTICLE_OG_IMAGE';

-- AlterTable
ALTER TABLE "articles" ADD COLUMN     "noindex" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "og_image_id" INTEGER,
ADD COLUMN     "seo_description" TEXT,
ADD COLUMN     "seo_title" TEXT;

-- AddForeignKey
ALTER TABLE "articles" ADD CONSTRAINT "articles_og_image_id_fkey" FOREIGN KEY ("og_image_id") REFERENCES "media_files"("id") ON DELETE SET NULL ON UPDATE CASCADE;
