-- AlterTable
ALTER TABLE "EventLog" ADD COLUMN     "subject_id" INTEGER;

-- AddForeignKey
ALTER TABLE "EventLog" ADD CONSTRAINT "EventLog_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "Subject"("id") ON DELETE SET NULL ON UPDATE CASCADE;
