-- DropForeignKey
ALTER TABLE "Score" DROP CONSTRAINT "Score_student_id_fkey";

-- DropForeignKey
ALTER TABLE "ScoreLog" DROP CONSTRAINT "ScoreLog_score_id_fkey";

-- AddForeignKey
ALTER TABLE "Score" ADD CONSTRAINT "Score_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScoreLog" ADD CONSTRAINT "ScoreLog_score_id_fkey" FOREIGN KEY ("score_id") REFERENCES "Score"("id") ON DELETE CASCADE ON UPDATE CASCADE;
