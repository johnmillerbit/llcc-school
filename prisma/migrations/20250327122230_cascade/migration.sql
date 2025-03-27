-- DropForeignKey
ALTER TABLE "EventLog" DROP CONSTRAINT "EventLog_student_id_fkey";

-- AddForeignKey
ALTER TABLE "EventLog" ADD CONSTRAINT "EventLog_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;
