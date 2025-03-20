/*
  Warnings:

  - You are about to drop the column `semester` on the `Score` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[student_id,subject_id,term]` on the table `Score` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `term` to the `Score` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Score_student_id_subject_id_semester_key";

-- AlterTable
ALTER TABLE "Score" DROP COLUMN "semester",
ADD COLUMN     "term" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Student" ALTER COLUMN "id" DROP DEFAULT;

-- CreateIndex
CREATE UNIQUE INDEX "Score_student_id_subject_id_term_key" ON "Score"("student_id", "subject_id", "term");
