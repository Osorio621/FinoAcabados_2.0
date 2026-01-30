-- AlterTable
ALTER TABLE "products" ADD COLUMN "slug" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "products_slug_key" ON "products"("slug");

-- CreateIndex
CREATE INDEX "idx_products_slug" ON "products"("slug");
