# Use the official Node.js 18 image as the base image
FROM node:18 AS build

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Alpine image to reduce image size
FROM node:alpine as main

# Set the working directory in the container
WORKDIR /app

# Copy necessary files from the build stage
COPY --from=build /app /app

# Expose the port on which the app will run
EXPOSE 5000

# Start the backend server
CMD ["node", "./src/app.js"]
