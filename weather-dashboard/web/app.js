const form = document.getElementById('searchForm');
const cityInput = document.getElementById('cityInput');
const statusEl = document.getElementById('status');
const currentEl = document.getElementById('current');
const currentContent = document.getElementById('currentContent');
const hourlyEl = document.getElementById('hourly');
const hourlyContent = document.getElementById('hourlyContent');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const city = cityInput.value.trim();
  if (!city) return;
  statusEl.textContent = 'Loading...';
  currentEl.classList.add('hidden');
  hourlyEl.classList.add('hidden');

  try {
    const res = await fetch(`/api/weather?city=${encodeURIComponent(city)}`);
    if (!res.ok) {
      const err = await res.json();
      statusEl.textContent = `Error: ${err.detail || res.statusText}`;
      return;
    }
    const data = await res.json();
    statusEl.textContent = '';

    const loc = data.location;
    const fw = data.forecast;
    const cw = fw.current_weather || {};

    currentContent.innerHTML = `
      <strong>${loc.name}, ${loc.country || ''}</strong><br/>
      Temperature: ${cw.temperature ?? 'N/A'} °C<br/>
      Wind: ${cw.windspeed ?? 'N/A'} km/h<br/>
      Wind direction: ${cw.winddirection ?? 'N/A'}°
    `;
    currentEl.classList.remove('hidden');

    // Build simple hourly table (next 24 entries)
    const times = fw.hourly.time || [];
    const temps = fw.hourly.temperature_2m || [];
    const humid = fw.hourly.relativehumidity_2m || [];
    const precip = fw.hourly.precipitation || [];

    let rows = '';
    const limit = Math.min(times.length, 24);
    rows += '<table><tr><th>Time</th><th>Temp (°C)</th><th>Humidity (%)</th><th>Precip (mm)</th></tr>';
    for (let i = 0; i < limit; i++) {
      rows += `<tr><td>${times[i]}</td><td>${temps[i] ?? ''}</td><td>${humid[i] ?? ''}</td><td>${precip[i] ?? ''}</td></tr>`;
    }
    rows += '</table>';
    hourlyContent.innerHTML = rows;
    hourlyEl.classList.remove('hidden');

  } catch (err) {
    statusEl.textContent = 'Request failed: ' + err.message;
  }
});
