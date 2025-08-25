import { PrismaClient } from "@prisma/client";
import { ClickEvent } from "../../config";

const prisma = new PrismaClient()

export const handleClicked_Course = async (clickEvent: ClickEvent) => {
  console.log(clickEvent)

}

export const handleClicked_Category = async (clickEvent: ClickEvent) => {
  await prisma.$transaction(async (tx) => {
    const res = await tx.userClick.create({
      data: {
        clickType: clickEvent.type,
        targetId: clickEvent.targetId,
        userId: clickEvent.userId,
      },
    });

    console.log("res: ",res)

    // Trim old clicks in one SQL query
    await tx.$executeRaw`
    DELETE FROM "UserClick"
    WHERE id IN (
      SELECT id FROM (
        SELECT id,
               ROW_NUMBER() OVER (PARTITION BY "userId" ORDER BY "timestamp" DESC) AS rn
        FROM "UserClick"
        WHERE "userId" = ${clickEvent.userId}
      ) sub
      WHERE rn > 150
    )
  `;
  });
};
