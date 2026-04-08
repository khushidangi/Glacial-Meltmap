FROM node:18-alpine AS frontend-build

WORKDIR /app

# Copy frontend files
COPY package*.json ./
COPY tailwind.config.js ./
COPY postcss.config.js ./
COPY src/ ./src/
COPY public/ ./public/

# Build frontend
RUN npm install
RUN npm run build

# ====================================
# Python backend stage
FROM python:3.10-slim

WORKDIR /app

# Install system dependencies for GDAL and geospatial tools
RUN apt-get update && apt-get install -y \
    gdal-bin \
    libgdal-dev \
    libspatialindex-dev \
    proj-bin \
    libproj-dev \
    build-essential \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Set GDAL environment variables
ENV GDAL_CONFIG=/usr/bin/gdal-config
ENV CPLUS_INCLUDE_PATH=/usr/include/gdal
ENV C_INCLUDE_PATH=/usr/include/gdal

# Copy backend requirements
COPY backend/requirements.txt ./requirements.txt

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code
COPY backend/ ./backend/

# Copy built frontend
COPY --from=frontend-build /app/build ./backend/static

# Create necessary directories
RUN mkdir -p data/shapefiles models output logs

# Expose ports
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:5000/api/health || exit 1

# Set environment
ENV FLASK_APP=backend/app.py
ENV FLASK_ENV=production
ENV PYTHONUNBUFFERED=1

# Run the application
CMD ["python", "-m", "gunicorn", \
     "--bind", "0.0.0.0:5000", \
     "--workers", "4", \
     "--timeout", "120", \
     "--access-logfile", "logs/access.log", \
     "--error-logfile", "logs/error.log", \
     "backend.app:app"]
