FROM python:3.9-slim

WORKDIR /app

# Install system dependencies if any (e.g. nmap later)
# We will likely need nmap later, let's install it now to save time
RUN apt-get update && apt-get install -y nmap && rm -rf /var/lib/apt/lists/*

COPY pyproject.toml .

# Install dependencies using pip (since pyproject.toml is standard)
# But we defined [tool.poetry], so let's try to use poetry or just pip install .
# Using pip with standard pyproject.toml is easier for simple setups, 
# but we need poetry to read the tool.poetry section properly or just install pydantic/fastapi etc manually if pip doesn't transparently support poetry sections well without a build backend.
# Actually, pip install . works if build-system is set up. 
# But let's just use pip to install the packages directly for simplicity and robustness in this environment.
# Or better, just use poetry as intended.

RUN pip install poetry
RUN poetry config virtualenvs.create false
RUN poetry install --no-root

COPY . .

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
