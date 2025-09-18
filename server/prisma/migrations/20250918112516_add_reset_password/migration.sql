/*
  Warnings:

  - The `resetPasswordExpiry` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "resetPasswordExpiry",
ADD COLUMN     "resetPasswordExpiry" TIMESTAMP(3);
