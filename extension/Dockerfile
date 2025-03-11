FROM node:18-slim

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Expose port if needed for development server
EXPOSE 3000

# Command to start development
CMD ["npm", "start"] 