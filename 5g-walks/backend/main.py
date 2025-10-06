from fastapi import FastAPI, HTTPException, Request, Body
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from typing import Dict, Any
import os
import requests
import logging
import urllib.parse
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

app = FastAPI()

# Development CORS: allow frontend dev server(s)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174", "http://localhost:3000", "http://localhost:8000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/hello")
def read_root():
    return {"message": "Hello from Python backend!"}


@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    # return JSON for HTTPException
    return JSONResponse(status_code=exc.status_code, content={"detail": exc.detail})


@app.exception_handler(Exception)
async def unhandled_exception(request: Request, exc: Exception):
    logging.exception("Unhandled exception: %s", exc)
    return JSONResponse(status_code=500, content={"detail": "Internal server error"})


def _human_time(seconds: int) -> str:
    if seconds is None:
        return ""
    m, s = divmod(int(seconds), 60)
    h, m = divmod(m, 60)
    if h:
        return f"{h}h {m}m {s}s"
    if m:
        return f"{m}m {s}s"
    return f"{s}s"


@app.get("/api/route")
def get_route(from_addr: str, to: str, units: str = "metric"):
    """
    Proxy endpoint to MapQuest Directions API.
    Query params:
      - from_addr: origin address or place
      - to: destination address or place
      - units: "metric" (kilometers) or "imperial" (miles)
    """
    key = os.getenv("MAPQUEST_API_KEY") or os.getenv("VITE_MAPQUEST_API_KEY")
    if not key:
        raise HTTPException(status_code=500, detail="MapQuest API key not configured on backend (MAPQUEST_API_KEY).")

    unit_param = "k" if units == "metric" else "m"
    params = {
        "key": key,
        "from": from_addr,
        "to": to,
        "unit": unit_param,
    }

    url = "http://www.mapquestapi.com/directions/v2/route"
    try:
        resp = requests.get(url, params=params, timeout=10)
    except requests.RequestException as e:
        raise HTTPException(status_code=502, detail=f"Error contacting MapQuest: {e}")

    if resp.status_code != 200:
        # try to extract JSON error
        try:
            body = resp.json()
            raise HTTPException(status_code=resp.status_code, detail=body)
        except Exception:
            raise HTTPException(status_code=resp.status_code, detail="MapQuest returned an error")

    data = resp.json()
    route = data.get("route")
    if not route:
        raise HTTPException(status_code=404, detail="No route data returned by MapQuest")

    distance = route.get("distance")
    time_seconds = route.get("time")
    formatted_time = _human_time(time_seconds)

    steps = []
    for leg in route.get("legs", []):
        for maneuver in leg.get("maneuvers", []):
            steps.append({
                "narrative": maneuver.get("narrative"),
                "distance": maneuver.get("distance"),
            })

    # extract shape points (flat list: lat,lng,lat,lng,...) -> convert to [[lat,lng],...]
    shape_points = []
    try:
        flat = route.get('shape', {}).get('shapePoints') or []
        for i in range(0, len(flat), 2):
            lat = flat[i]
            lng = flat[i+1] if i+1 < len(flat) else None
            if lng is not None:
                shape_points.append([lat, lng])
    except Exception:
        shape_points = []

    # normalized locations (start/end) if available
    norm_locations = []
    try:
        for loc in route.get('locations', []) or []:
            latlng = loc.get('latLng') or {}
            norm_locations.append({
                'display': ', '.join([p for p in [loc.get('street'), loc.get('adminArea5'), loc.get('adminArea3')] if p]) or loc.get('adminArea5') or '',
                'lat': latlng.get('lat'),
                'lng': latlng.get('lng')
            })
    except Exception:
        norm_locations = []

    # Construct a MapQuest Static Map URL for a quick preview image of the route.
    try:
        from urllib.parse import urlencode
        static_base = "https://www.mapquestapi.com/staticmap/v5/map"
        static_params = {
            "key": key,
            # size: width,height in pixels
            "size": "800,400",
            # provide start/end to draw the route
            "start": from_addr,
            "end": to,
            # show a reasonable route line color and thickness
            "routeColor": "4267B2",
            "routeWidth": "6",
        }
        static_map_url = f"{static_base}?{urlencode(static_params)}"
    except Exception:
        static_map_url = None

    # MapQuest directions URL (opens on mapquest.com with query parameters)
    try:
        directions_base = "https://www.mapquest.com/directions"
        # simple route link using encoded start and end
        directions_link = f"{directions_base}/{urllib.parse.quote(from_addr)}/{urllib.parse.quote(to)}"
    except Exception:
        directions_link = None

    return {
        "distance": distance,
        "time_seconds": time_seconds,
        "formatted_time": formatted_time,
        "units": "km" if unit_param == "k" else "miles",
        "steps": steps,
        "static_map_url": static_map_url,
        "directions_link": directions_link,
        "raw": route,
        "shape": shape_points,
        "locations": norm_locations,
    }



@app.get('/api/search')
def place_search(q: str, maxResults: int = 5):
    """
    Full place search (geocoding). Returns a list of candidate places with display name and lat/lng.
    Query param: q (required), maxResults (optional)
    """
    key = os.getenv("MAPQUEST_API_KEY") or os.getenv("VITE_MAPQUEST_API_KEY")
    if not key:
        raise HTTPException(status_code=500, detail="MapQuest API key not configured on backend (MAPQUEST_API_KEY).")

    geocode_url = "http://www.mapquestapi.com/geocoding/v1/address"
    params = {"key": key, "location": q, "maxResults": maxResults}
    try:
        resp = requests.get(geocode_url, params=params, timeout=10)
    except requests.RequestException as e:
        raise HTTPException(status_code=502, detail=f"Error contacting MapQuest Geocoding: {e}")

    if resp.status_code != 200:
        try:
            body = resp.json()
            raise HTTPException(status_code=resp.status_code, detail=body)
        except Exception:
            raise HTTPException(status_code=resp.status_code, detail="MapQuest geocoding returned an error")

    data = resp.json()
    results = []
    for res in data.get('results', []):
        for loc in res.get('locations', []):
            display = ', '.join([p for p in [loc.get('street'), loc.get('adminArea5'), loc.get('adminArea3'), loc.get('adminArea1')] if p])
            latlng = loc.get('latLng') or {}
            results.append({"display": display or loc.get('adminArea5') or loc.get('adminArea3'), "lat": latlng.get('lat'), "lng": latlng.get('lng'), "raw": loc})

    return {"query": q, "results": results[:maxResults]}


@app.get('/api/searchahead')
def search_ahead(q: str, maxResults: int = 5):
    """
    Lightweight autocomplete using geocoding endpoint (returns top matches).
    """
    return place_search(q=q, maxResults=maxResults)


@app.post('/api/walk')
def create_walk_route(request_body: Dict[str, Any] = Body(...)):
    """
    Create an optimal walking route using MapQuest API.
    Only supports pedestrian modes: walking and running.
    
    Request body:
    {
        "from_addr": "start address",
        "to": "destination address",
        "route_type": "walking" or "running",
        "units": "metric" or "imperial" (optional, defaults to metric)
    }
    """
    from_addr = request_body.get('from_addr')
    to = request_body.get('to')
    route_type = request_body.get('route_type', 'walking')
    units = request_body.get('units', 'metric')
    
    # Validate inputs
    if not from_addr or not to:
        raise HTTPException(status_code=400, detail="Both 'from_addr' and 'to' are required")
    
    # Only allow walking and running
    if route_type not in ['walking', 'running']:
        raise HTTPException(status_code=400, detail="route_type must be 'walking' or 'running'")
    
    key = os.getenv("MAPQUEST_API_KEY") or os.getenv("VITE_MAPQUEST_API_KEY")
    if not key:
        raise HTTPException(status_code=500, detail="MapQuest API key not configured on backend (MAPQUEST_API_KEY).")

    unit_param = "k" if units == "metric" else "m"
    
    # MapQuest pedestrian routing parameters
    params = {
        "key": key,
        "from": from_addr,
        "to": to,
        "unit": unit_param,
        "routeType": "pedestrian",  # Always use pedestrian routing
        "narrativeType": "text",
    }

    url = "http://www.mapquestapi.com/directions/v2/route"
    try:
        resp = requests.get(url, params=params, timeout=15)
    except requests.RequestException as e:
        raise HTTPException(status_code=502, detail=f"Error contacting MapQuest: {e}")

    if resp.status_code != 200:
        try:
            body = resp.json()
            raise HTTPException(status_code=resp.status_code, detail=body)
        except Exception:
            raise HTTPException(status_code=resp.status_code, detail="MapQuest returned an error")

    data = resp.json()
    route = data.get("route")
    if not route:
        raise HTTPException(status_code=404, detail="No route data returned by MapQuest")

    distance = route.get("distance")
    time_seconds = route.get("time")
    formatted_time = _human_time(time_seconds)

    # Extract turn-by-turn directions
    steps = []
    for leg in route.get("legs", []):
        for maneuver in leg.get("maneuvers", []):
            steps.append({
                "narrative": maneuver.get("narrative"),
                "distance": maneuver.get("distance"),
                "time": maneuver.get("time"),
            })

    # Extract shape points (flat list: lat,lng,lat,lng,...) -> convert to [[lat,lng],...]
    shape_points = []
    try:
        flat = route.get('shape', {}).get('shapePoints') or []
        for i in range(0, len(flat), 2):
            lat = flat[i]
            lng = flat[i+1] if i+1 < len(flat) else None
            if lng is not None:
                shape_points.append([lat, lng])
    except Exception:
        shape_points = []

    # Normalized locations (start/end) if available
    norm_locations = []
    try:
        for loc in route.get('locations', []) or []:
            latlng = loc.get('latLng') or {}
            norm_locations.append({
                'display': ', '.join([p for p in [loc.get('street'), loc.get('adminArea5'), loc.get('adminArea3')] if p]) or loc.get('adminArea5') or '',
                'lat': latlng.get('lat'),
                'lng': latlng.get('lng')
            })
    except Exception:
        norm_locations = []

    # Construct a MapQuest Static Map URL for a preview image
    try:
        from urllib.parse import urlencode
        static_base = "https://www.mapquestapi.com/staticmap/v5/map"
        static_params = {
            "key": key,
            "size": "800,400",
            "start": from_addr,
            "end": to,
            "routeColor": "FC4C02",  # Strava orange
            "routeWidth": "6",
        }
        static_map_url = f"{static_base}?{urlencode(static_params)}"
    except Exception:
        static_map_url = None

    # MapQuest directions URL
    try:
        directions_base = "https://www.mapquest.com/directions"
        directions_link = f"{directions_base}/{urllib.parse.quote(from_addr)}/{urllib.parse.quote(to)}"
    except Exception:
        directions_link = None

    return {
        "success": True,
        "route_type": route_type,
        "distance": distance,
        "time_seconds": time_seconds,
        "formatted_time": formatted_time,
        "units": "km" if unit_param == "k" else "miles",
        "steps": steps,
        "shape": shape_points,
        "locations": norm_locations,
        "static_map_url": static_map_url,
        "directions_link": directions_link,
        "raw": route,
    }
