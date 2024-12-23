# Use a Node.js image as base
FROM node:18-alpine

# Set the working directory inside the container
#RUN mkdir /app

WORKDIR /app

# Copy necessary files from host to container
COPY package.json .
COPY package-lock.json .
COPY . .

# Install project dependencies
RUN npm install

# Expose the port that the Express server is listening on
EXPOSE 3000

# Start the application when the container is started
CMD ["node", "app.js"]

