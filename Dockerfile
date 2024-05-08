FROM python:3.8-slim
# No buffer to terminal
ENV PYTHONUNBUFFERED=1
# No cache files (*.pyc files)
ENV PYTHONDONTWRITEBYTECODE=1
# Container working dir
WORKDIR /code

COPY requirements.txt /code/

RUN python -m pip install --upgrade pip
RUN python -m pip install -r requirements.txt

COPY . /code/sudo

# FROM python:3.8-slim
# # Set environment variables
# ENV PYTHONUNBUFFERED=1
# ENV PYTHONDONTWRITEBYTECODE=1
# # Set working directory
# WORKDIR /code
# # Install system dependencies
# RUN apt-get update \
#     && apt-get install -y --no-install-recommends gcc libpq-dev build-essential libc6-dev \
#     && apt-get clean \
#     && rm -rf /var/lib/apt/lists/*
# # Install Python dependencies
# COPY requirements.txt /code/
# RUN python -m pip install --upgrade pip \
#     && pip install -r requirements.txt
# # Copy the rest of the application
# COPY . /code/