FROM node:alpine

WORKDIR /app

COPY . .

RUN npm install

# Copy the start.sh into the container
COPY start.sh .

# Make the shell script executable
RUN chmod +x start.sh

# Execute the shell script
CMD ["/bin/sh", "start.sh"]
