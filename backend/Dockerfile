FROM python:3.8-slim

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first to leverage Docker cache
COPY requirements.txt .
COPY environment.yml .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application
COPY . .

# Set environment variables
ENV FLASK_APP=app.py
ENV FLASK_ENV=production
ENV API_PORT=5002
ENV FLASK_DEBUG=1

# Expose the port the app runs on
EXPOSE 5002

# Command to run the application
CMD ["python", "app.py"] 