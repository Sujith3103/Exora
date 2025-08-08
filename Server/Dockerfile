FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm install --production

# Copy Prisma schema and run generate BEFORE copying rest of the app
COPY prisma ./prisma

RUN npx prisma generate

# Now copy the rest of your app code
COPY . .

EXPOSE 3000

CMD ["node", "dist/index.js"]
