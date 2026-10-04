-- Phase S contract step (S9): every project links to a service by now, so the
-- superseded service_category / service_slug columns go and service_id becomes
-- required. Fails (and changes nothing) if any project still has no service.

-- DropForeignKey
ALTER TABLE "projects" DROP CONSTRAINT "projects_service_id_fkey";

-- AlterTable
ALTER TABLE "projects" DROP COLUMN "service_category",
DROP COLUMN "service_slug",
ALTER COLUMN "service_id" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "services"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

