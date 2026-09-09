from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
import httpx

app = FastAPI(title="Weather Dashboard API")

# Serve the static frontend from the /web directory
app.mount("/", StaticFiles(directory="web", html=True), name="web")

GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search"
FORECAST_URL = "https://api.open-meteo.com/v1/forecast"

async def fetch_geocode(city: str):
    params = {"name": city, "count": 1}
    async with httpx.AsyncClient(timeout=10) as client:
        r = await client.get(GEOCODING_URL, params=params)
        r.raise_for_status()
        data = r.json()
        if "results" not in data or not data["results"]:
            return None
        return data["results"][0]

@app.get('/api/health')
async def health():
    return {"status": "ok"}

@app.get('/api/weather')
async def get_weather(city: str):
    """Return current weather + hourly data for a city using Open-Meteo.

    Query params:
    - city: city name (e.g. "London")
    """
    geocode = await fetch_geocode(city)
    if not geocode:
        raise HTTPException(status_code=404, detail="City not found")

    lat = geocode["latitude"]
    lon = geocode["longitude"]
    timezone = geocode.get("timezone", "auto")

    params = {
        "latitude": lat,
        "longitude": lon,
        "current_weather": True,
        "hourly": "temperature_2m,relativehumidity_2m,precipitation",
        "timezone": timezone
    }

    async with httpx.AsyncClient(timeout=10) as client:
        r = await client.get(FORECAST_URL, params=params)
        r.raise_for_status()
        forecast = r.json()

    return {
        "location": {
            "name": geocode.get("name"),
            "country": geocode.get("country"),
            "latitude": lat,
            "longitude": lon,
        },
        "forecast": forecast
    }
