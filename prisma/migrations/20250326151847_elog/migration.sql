-- AlterTable
ALTER TABLE "EventLog" ADD COLUMN     "student_id" TEXT,
ADD COLUMN     "term" INTEGER;

-- AddForeignKey
ALTER TABLE "EventLog" ADD CONSTRAINT "EventLog_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "Student"("id") ON DELETE SET NULL ON UPDATE CASCADE;
