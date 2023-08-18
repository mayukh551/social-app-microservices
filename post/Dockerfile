FROM node:alpine

WORKDIR /app

COPY . .

RUN npm install

# Copy the setup.sh into the container
COPY setup.sh .

# Change the file format to unix: CRLF to LF
RUN sed -i 's/\r$//' setup.sh

# Make the shell script executable
RUN chmod +x setup.sh

# Execute the shell script
CMD ["/bin/sh", "setup.sh"]
