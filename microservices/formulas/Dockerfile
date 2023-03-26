FROM python:3.11-slim-buster

RUN apt-get update && apt-get install -y \
    curl \
    && rm -rf /var/lib/apt/lists/*

RUN pip3 install poetry

ENV PATH="${PATH}:/root/.poetry/bin"

WORKDIR /app

COPY pyproject.toml poetry.lock ./

RUN poetry config virtualenvs.create false \
    && poetry install --no-interaction --no-ansi

COPY . .

COPY .env.docker ./.env

# Expose port 8002 to the outside world
EXPOSE 8002

# Run the Django application
CMD ["poetry", "run", "python", "manage.py", "runserver", "0.0.0.0:8002"]