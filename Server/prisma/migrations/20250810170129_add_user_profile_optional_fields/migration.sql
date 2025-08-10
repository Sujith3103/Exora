-- CreateTable
CREATE TABLE "public"."UserSecurity" (
    "id" TEXT NOT NULL,
    "twoStepVerification" BOOLEAN,
    "lastPasswordChange" TIMESTAMP(3),
    "recoveryEmail" TEXT,
    "recoveryPhone" TEXT,
    "loginAlertsEnabled" BOOLEAN,
    "userId" TEXT NOT NULL,

    CONSTRAINT "UserSecurity_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserSecurity_userId_key" ON "public"."UserSecurity"("userId");

-- AddForeignKey
ALTER TABLE "public"."UserSecurity" ADD CONSTRAINT "UserSecurity_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
