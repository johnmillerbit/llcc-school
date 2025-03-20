/*
  Warnings:

  - You are about to drop the column `firstname` on the `Teacher` table. All the data in the column will be lost.
  - You are about to drop the column `lastname` on the `Teacher` table. All the data in the column will be lost.
  - You are about to drop the `Admin` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `password` to the `Teacher` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `Teacher` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Teacher" DROP COLUMN "firstname",
DROP COLUMN "lastname",
ADD COLUMN     "password" TEXT NOT NULL,
ADD COLUMN     "username" TEXT NOT NULL;

-- DropTable
DROP TABLE "Admin";

-- CreateTable
CREATE TABLE "ScoreLog" (
    "id" SERIAL NOT NULL,
    "status" TEXT NOT NULL,
    "old_value" DOUBLE PRECISION,
    "new_value" DOUBLE PRECISION NOT NULL,
    "score_id" INTEGER NOT NULL,
    "change_by" INTEGER NOT NULL,
    "update_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ScoreLog_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ScoreLog" ADD CONSTRAINT "ScoreLog_score_id_fkey" FOREIGN KEY ("score_id") REFERENCES "Score"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScoreLog" ADD CONSTRAINT "ScoreLog_change_by_fkey" FOREIGN KEY ("change_by") REFERENCES "Teacher"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
