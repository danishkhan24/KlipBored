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

# Declare the build argument
ARG AWS_REGION
ARG DYNAMODB_TABLE_NAME
ARG AWS_ACCESS_KEY_ID
ARG AWS_SECRET_ACCESS_KEY

# Set them as environment variables in the container
ENV AWS_REGION=${AWS_REGION}
ENV DYNAMODB_TABLE_NAME=${DYNAMODB_TABLE_NAME}
ENV AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID}
ENV AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY}

# Copy necessary files from the build stage
COPY --from=build /app /app

# Expose the port on which the app will run
EXPOSE 5000

# Start the backend server
CMD ["node", "./src/app.js"]
