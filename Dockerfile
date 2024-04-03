# Use the official Node.js 16 image as a base
FROM node:16

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Install Prisma globally
RUN npm install -g prisma

# Copy the rest of the application code to the working directory
COPY . .

# Copy example.env to .env
# COPY example.env .env

# Build TypeScript files
RUN npm run build

# Prisma setup commands
RUN npx prisma generate
# RUN npx prisma migrate deploy --preview-feature

# Expose the port the app runs on
EXPOSE 3000

# Command to run the app
CMD ["npm", "start"]
