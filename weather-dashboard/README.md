# Weather Dashboard

This simple Weather Dashboard uses FastAPI (backend) and a minimal static frontend to fetch weather data from Open-Meteo (no API key required).

Features
- Search by city name (uses Open-Meteo geocoding)
- Shows current weather (temperature, wind)
- Shows next 24 hours hourly table (temperature, humidity, precipitation)

Run locally (Python)

1. Python 3.10+ recommended
2. cd weather-dashboard/backend
3. python -m venv .venv && source .venv/bin/activate  # or use your preferred venv
4. pip install -r requirements.txt
5. uvicorn main:app --reload --host 0.0.0.0 --port 8000
6. Open http://localhost:8000 in your browser

Run locally with Docker (recommended)

1. From the repository root run:
   docker compose -f weather-dashboard/docker-compose.yml up --build
2. Open http://localhost:8000

Notes
- This project uses Open-Meteo's free APIs: https://open-meteo.com/
- No API keys are required. For production, consider caching results and adding rate limits.

Possible improvements
- Add map-based location picker
- Persist search history or favorites
- Add icons for weathercodes
- Add unit tests and CI
