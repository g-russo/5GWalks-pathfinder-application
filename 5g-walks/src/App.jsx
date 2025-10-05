import React, { useEffect, useState, useRef } from 'react';

function App() {
  const [message, setMessage] = useState('Welcome to 5G Walks — enter origin and destination to get a route');
  const [fromAddr, setFromAddr] = useState('');
  const [toAddr, setToAddr] = useState('');
  const [units, setUnits] = useState('imperial');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [useInteractive, setUseInteractive] = useState(false);

  const API_BASE = (import.meta && import.meta.env && import.meta.env.VITE_API_BASE_URL) || 'http://localhost:8000';

  // suggestions
  const [fromSuggestions, setFromSuggestions] = useState([]);
  const [toSuggestions, setToSuggestions] = useState([]);
  const fromTimerRef = useRef(null);
  const toTimerRef = useRef(null);
  // refs for interactive map (created only if user enables interactive mode)
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const fromMarkerRef = useRef(null);
  const toMarkerRef = useRef(null);
  const polyRef = useRef(null);

  useEffect(() => {
    return () => {
      if (fromTimerRef.current) clearTimeout(fromTimerRef.current);
      if (toTimerRef.current) clearTimeout(toTimerRef.current);
    };
  }, []);



  function debounceFetch(query, setter, timerRef) {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(async () => {
      if (!query) return setter([]);
      try {
        const url = `${API_BASE.replace(/\/$/, '')}/api/searchahead?q=${encodeURIComponent(query)}&maxResults=6`;
        const res = await fetch(url);
        if (!res.ok) return setter([]);
        const data = await res.json();
        setter(data.results || []);
      } catch (e) {
        setter([]);
      }
    }, 300);
  }

  async function fetchRoute(e) {
    e && e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const params = new URLSearchParams({ from_addr: fromAddr, to: toAddr, units });
      const url = `${API_BASE.replace(/\/$/, '')}/api/route?${params.toString()}`;
      const res = await fetch(url);
      const ct = res.headers.get('content-type') || '';
      if (!res.ok) {
        if (ct.includes('application/json')) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.detail || JSON.stringify(body) || res.statusText || `HTTP ${res.status}`);
        }
        const text = await res.text().catch(() => res.statusText || `HTTP ${res.status}`);
        throw new Error(text);
      }
      if (ct.includes('application/json')) {
        const data = await res.json();
        setResult(data);
        // If user wants an interactive map, try to render it (Leaflet script is included via index.html)
        if (useInteractive) {
          setTimeout(() => {
            try { renderInteractiveMap(data); } catch (err) { console.warn('Interactive map render failed', err); }
          }, 50);
        }
      } else {
        const text = await res.text();
        throw new Error('Unexpected non-JSON response from backend: ' + text.slice(0, 200));
      }
    } catch (err) {
      setError(err.message || String(err));
    } finally {
      setLoading(false);
    }
  }

  function renderInteractiveMap(data) {
    const L = typeof window !== 'undefined' && window.L;
    const container = mapContainerRef.current;
    if (!L || !container) return;

    // initialize map if needed
    if (!mapInstanceRef.current) {
      mapInstanceRef.current = L.map(container, { center: [40.73, -73.93], zoom: 10, preferCanvas: true });
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(mapInstanceRef.current);
    }

    const map = mapInstanceRef.current;

    // remove existing polyline and markers
    try {
      if (polyRef.current) { map.removeLayer(polyRef.current); polyRef.current = null; }
      if (fromMarkerRef.current) { map.removeLayer(fromMarkerRef.current); fromMarkerRef.current = null; }
      if (toMarkerRef.current) { map.removeLayer(toMarkerRef.current); toMarkerRef.current = null; }
    } catch (e) { /* ignore */ }

    // place markers
    const locs = data.locations || [];
    if (locs && locs.length >= 1 && locs[0].lat && locs[0].lng) {
      fromMarkerRef.current = L.marker([locs[0].lat, locs[0].lng]).addTo(map).bindPopup(locs[0].display || 'Start');
    } else if (data.raw && data.raw.locations && data.raw.locations[0] && data.raw.locations[0].latLng) {
      const ll = data.raw.locations[0].latLng; fromMarkerRef.current = L.marker([ll.lat, ll.lng]).addTo(map).bindPopup('Start');
    }
    if (locs && locs.length >= 2 && locs[1].lat && locs[1].lng) {
      toMarkerRef.current = L.marker([locs[1].lat, locs[1].lng]).addTo(map).bindPopup(locs[1].display || 'End');
    } else if (data.raw && data.raw.locations && data.raw.locations[1] && data.raw.locations[1].latLng) {
      const ll = data.raw.locations[1].latLng; toMarkerRef.current = L.marker([ll.lat, ll.lng]).addTo(map).bindPopup('End');
    }

    // draw polyline from shape
    if (data.shape && data.shape.length > 0) {
      polyRef.current = L.polyline(data.shape, { color: '#4267B2', weight: 5, opacity: 0.8 }).addTo(map);
      map.fitBounds(polyRef.current.getBounds(), { padding: [40, 40] });
    } else {
      const points = [];
      if (fromMarkerRef.current) points.push(fromMarkerRef.current.getLatLng());
      if (toMarkerRef.current) points.push(toMarkerRef.current.getLatLng());
      if (points.length) {
        const bounds = L.latLngBounds(points);
        map.fitBounds(bounds.pad(0.3));
      }
    }
  }

  // cleanup when toggling interactive mode off or unmount
  useEffect(() => {
    return () => {
      try {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
        }
      } catch (e) {}
    };
  }, []);

  // when toggling interactive mode on and we already have a result, render the map
  useEffect(() => {
    if (useInteractive && result) {
      try { renderInteractiveMap(result); } catch (e) { console.warn(e); }
    }
    if (!useInteractive) {
      // destroy map when disabling interactive mode
      try {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
        }
      } catch (e) {}
      // clear refs
      try { fromMarkerRef.current = null; toMarkerRef.current = null; polyRef.current = null; } catch (e) {}
    }
  }, [useInteractive, result]);

  return (
    <div className="app-wrapper">
      <div className="card app-card">
        <div className="app-header">
          <h1 className="app-title">5G Walks</h1>
          <div className="read-the-docs">Powered by MapQuest</div>
        </div>

        <p>{message}</p>

        <div className="app-main">
          <div className="app-form">
            <form onSubmit={fetchRoute} className="route-form">
              <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 8 }}>
                <label style={{ margin: 0 }}>
                  <input type="checkbox" checked={useInteractive} onChange={(e) => setUseInteractive(e.target.checked)} />
                  &nbsp;Use interactive map
                </label>
                <div style={{ marginLeft: 'auto' }}>{loading && <span className="spinner" aria-hidden="true" />}</div>
              </div>
          <div className="form-row" style={{ maxWidth: 720 }}>
            <label>From</label>
            <div style={{ position: 'relative' }}>
              <input
                className="text-input"
                value={fromAddr}
                onChange={(e) => {
                  setFromAddr(e.target.value);
                  debounceFetch(e.target.value, setFromSuggestions, fromTimerRef);
                }}
                placeholder="Enter start address"
                required
              />

              {fromSuggestions.length > 0 && (
                <div className="suggestions">
                  {fromSuggestions.map((s, i) => (
                    <div
                      key={i}
                      className="suggestion-item"
                      onClick={() => {
                        setFromAddr(s.display);
                        setFromSuggestions([]);
                      }}
                    >
                      {s.display}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="form-row" style={{ maxWidth: 720 }}>
            <label>To</label>
            <div style={{ position: 'relative' }}>
              <input
                className="text-input"
                value={toAddr}
                onChange={(e) => {
                  setToAddr(e.target.value);
                  debounceFetch(e.target.value, setToSuggestions, toTimerRef);
                }}
                placeholder="Enter destination address"
                required
              />

              {toSuggestions.length > 0 && (
                <div className="suggestions">
                  {toSuggestions.map((s, i) => (
                    <div
                      key={i}
                      className="suggestion-item"
                      onClick={() => {
                        setToAddr(s.display);
                        setToSuggestions([]);
                      }}
                    >
                      {s.display}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="form-row controls">
            <div>
              <label style={{ display: 'block', marginBottom: 4 }}>Units</label>
              <select
                className="text-input"
                value={units}
                onChange={(e) => setUnits(e.target.value)}
                style={{ width: 160 }}
              >
                <option value="imperial">Miles</option>
                <option value="metric">Kilometers</option>
              </select>
            </div>

            <div style={{ marginLeft: 'auto' }}>
              <button className="btn btn-primary" type="submit" disabled={loading}>
                {loading ? 'Loading…' : 'Get Route'}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setFromAddr('');
                  setToAddr('');
                  setResult(null);
                  setError(null);
                }}
                style={{ marginLeft: 8 }}
              >
                Clear
              </button>
            </div>
          </div>
      </form>

      {error && <div style={{ color: 'red', marginTop: 12 }}>{error}</div>}

      {result && (
          <div style={{ marginTop: 18 }}>
            <h2>Summary</h2>
            {result.directions_link && (
              <div style={{ marginBottom: 8 }}>
                <a href={result.directions_link} target="_blank" rel="noreferrer">
                  Open on MapQuest
                </a>
              </div>
            )}

            <table className="summary-table">
              <tbody>
                <tr>
                  <td>Distance</td>
                  <td>
                    {result.distance} {result.units}
                  </td>
                </tr>
                <tr>
                  <td>Time</td>
                  <td>
                    {result.formatted_time} ({result.time_seconds}s)
                  </td>
                </tr>
              </tbody>
            </table>

            <h3>Steps</h3>
            <ol>
              {result.steps.map((s, i) => (
                <li key={i}>
                  {s.narrative} — {s.distance} {result.units}
                </li>
              ))}
            </ol>
            </div>
            )}
          </div>

          <div className="app-map">
            {useInteractive ? (
              <div style={{ width: '100%', height: 360 }}>
                <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />
              </div>
            ) : (
              result && result.static_map_url ? (
                <div style={{ width: '100%', maxWidth: 800 }}>
                  <a href={result.static_map_url} target="_blank" rel="noreferrer">
                    <img className="route-map" src={result.static_map_url} alt="Route map" />
                  </a>
                </div>
              ) : (
                <div style={{ width: '100%', height: 360, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666' }}>
                  <div>No map to display. Enter origin and destination and click "Get Route".</div>
                </div>
              )
            )}
          </div>
        </div>

        
      </div>
    </div>
  );
}

export default App;