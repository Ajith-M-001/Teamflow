-- DropForeignKey
ALTER TABLE "public"."Message" DROP CONSTRAINT "Message_channelId_fkey";

-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "threadId" TEXT,
ALTER COLUMN "channelId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "Channel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_threadId_fkey" FOREIGN KEY ("threadId") REFERENCES "Message"("id") ON DELETE CASCADE ON UPDATE CASCADE;
