/*
  Warnings:

  - You are about to drop the column `inventory` on the `GroceryItem` table. All the data in the column will be lost.
  - Added the required column `availableInventory` to the `GroceryItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "GroceryItem" DROP COLUMN "inventory",
ADD COLUMN     "availableInventory" INTEGER NOT NULL;
