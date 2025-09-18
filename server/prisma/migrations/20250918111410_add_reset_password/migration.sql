-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "resetPasswordExpiry" TEXT,
ADD COLUMN     "resetPasswordToken" TEXT;
