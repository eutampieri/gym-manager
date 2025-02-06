# Use a Node.js image as base
FROM node:22-alpine

# Set the working directory inside the container
#RUN mkdir /app

WORKDIR /app

# Copy necessary files from host to container
COPY package.json .
COPY package-lock.json .
COPY . .

# Install project dependencies
RUN npm install

WORKDIR /app/models
RUN ../node_modules/typescript/bin/tsc 
WORKDIR /app/backend
RUN ../node_modules/typescript/bin/tsc 

# Expose the port that the Express server is listening on
EXPOSE 3000

# Start the application when the container is started
CMD ["node", "app.js"]
LABEL "traefik.http.routers.backend.rule"="PathPrefix(`/api`)"
