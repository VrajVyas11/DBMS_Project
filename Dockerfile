# Use official Node.js LTS image
FROM node:18

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .


# Command to start the application
CMD ["node", "server.js"]
