/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `Course` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `Course` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `Department` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Course_code_key" ON "public"."Course"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Course_name_key" ON "public"."Course"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Department_name_key" ON "public"."Department"("name");
