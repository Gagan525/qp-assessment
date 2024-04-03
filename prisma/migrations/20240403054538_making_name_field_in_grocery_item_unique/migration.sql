/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `GroceryItem` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "GroceryItem_name_key" ON "GroceryItem"("name");
