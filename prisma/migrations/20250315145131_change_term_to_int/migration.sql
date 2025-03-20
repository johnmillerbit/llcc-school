/*
  Warnings:

  - Changed the type of `term` on the `Score` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Score" DROP COLUMN "term",
ADD COLUMN     "term" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Score_student_id_subject_id_term_key" ON "Score"("student_id", "subject_id", "term");
