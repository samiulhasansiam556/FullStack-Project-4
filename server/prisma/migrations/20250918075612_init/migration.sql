-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "isVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "verificationExpiry" TIMESTAMP(3),
ADD COLUMN     "verificationToken" TEXT;
