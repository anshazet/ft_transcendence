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