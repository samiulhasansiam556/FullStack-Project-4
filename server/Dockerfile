FROM node:18-alpine

WORKDIR /app

# Copy package.json & package-lock.json first
COPY package*.json ./

# Copy prisma schema first for npm install if you use prisma generate
COPY prisma ./prisma

# Install dependencies
RUN npm install

# Copy all project files
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Compile TypeScript
RUN npm run build

# Expose the port your server listens to
EXPOSE 4000

# Start the server
CMD ["npm", "start"]
