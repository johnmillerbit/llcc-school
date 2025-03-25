/*
  Warnings:

  - You are about to drop the `ScoreLog` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ScoreLog" DROP CONSTRAINT "ScoreLog_change_by_fkey";

-- DropForeignKey
ALTER TABLE "ScoreLog" DROP CONSTRAINT "ScoreLog_score_id_fkey";

-- DropTable
DROP TABLE "ScoreLog";

-- CreateTable
CREATE TABLE "EventLog" (
    "id" SERIAL NOT NULL,
    "status" TEXT NOT NULL,
    "old_value" DOUBLE PRECISION,
    "new_value" DOUBLE PRECISION,
    "score_id" INTEGER,
    "do_by" INTEGER NOT NULL,
    "update_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EventLog_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "EventLog" ADD CONSTRAINT "EventLog_score_id_fkey" FOREIGN KEY ("score_id") REFERENCES "Score"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventLog" ADD CONSTRAINT "EventLog_do_by_fkey" FOREIGN KEY ("do_by") REFERENCES "Teacher"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
