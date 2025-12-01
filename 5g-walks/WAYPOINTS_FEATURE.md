# Multiple Waypoints Feature

## Overview
Added support for multiple waypoints (stops) along walking/running routes. Users can now create routes with intermediate stops between the start and destination.

## Features Implemented

### 1. Frontend UI (`RouteForm.jsx`)
- **Add Stop Button**: Orange-themed button to add waypoints
- **Dynamic Waypoint Inputs**: Each waypoint gets its own input field with a remove button
- **Waypoint Management**:
  - `addWaypoint()` - Adds a new empty waypoint to the list
  - `removeWaypoint(index)` - Removes a specific waypoint
  - `updateWaypoint(index, value)` - Updates waypoint address
- **Visual Design**: Matches existing orange gradient theme (#FC4C02)
- **Empty State**: Shows helpful message when no waypoints exist

### 2. Backend API (`backend/main.py`)
- **Waypoints Parameter**: Accepts optional `waypoints` array in request body
- **Locations Array**: Builds locations array as: `[start, waypoint1, waypoint2, ..., end]`
- **MapQuest Integration**: Uses MapQuest Directions API v2 with locations array
- **Validation**: Filters out empty waypoints automatically
- **Backwards Compatible**: Waypoints are optional, existing routes still work

### 3. API Client (`src/lib/api.js`)
- **Updated `createWalkRoute()`**: Now accepts optional `waypoints` parameter
- **Waypoint Filtering**: Removes empty/invalid waypoints before sending to backend
- **Default Parameter**: `waypoints = []` for backwards compatibility

### 4. Route Creation (`CreateRoute.jsx`)
- **Waypoints Passed to API**: Form data includes waypoints array
- **Recent Searches**: Saves waypoints with route searches
- **Route Storage**: Waypoints stored in saved routes

### 5. Map Display (`MapView.jsx`)
- **Waypoint Markers**: Orange markers (#FC4C02) for intermediate stops
- **Marker Colors**:
  - Start: Green (#22c55e)
  - Waypoints: Orange (#FC4C02)
  - End: Red (#ef4444)
- **Popup Labels**: Shows "Stop 1", "Stop 2", etc. for waypoints
- **Route Line**: Polyline connects all points in order
- **Auto-Fit Bounds**: Map automatically adjusts to show all waypoints

## Usage

1. **Create a Route with Waypoints**:
   - Enter start location
   - Click "Add Stop" button
   - Enter waypoint address
   - Add multiple waypoints as needed
   - Enter destination
   - Generate route

2. **Waypoint Ordering**:
   - Waypoints are visited in the order they appear in the list
   - Route: Start → Waypoint 1 → Waypoint 2 → ... → End

3. **Remove Waypoints**:
   - Click the red X button next to any waypoint to remove it

## API Request Example

```json
{
  "from_addr": "New York, NY",
  "waypoints": [
    "Central Park, NY",
    "Times Square, NY"
  ],
  "to": "Empire State Building, NY",
  "route_type": "walking",
  "units": "metric"
}
```

## Response Structure

The API returns locations array including all waypoints:

```json
{
  "success": true,
  "distance": 5.2,
  "time_seconds": 3720,
  "locations": [
    {"lat": 40.7128, "lng": -74.0060, "display": "New York, NY"},
    {"lat": 40.7829, "lng": -73.9654, "display": "Central Park, NY"},
    {"lat": 40.7580, "lng": -73.9855, "display": "Times Square, NY"},
    {"lat": 40.7484, "lng": -73.9857, "display": "Empire State Building, NY"}
  ],
  "shape": [[40.7128, -74.0060], ...],
  "steps": [...]
}
```

## Technical Details

### MapQuest API Integration
- Uses `locations` parameter instead of `from`/`to` for multi-waypoint routing
- Supports unlimited waypoints (practical limit ~10-15 for performance)
- Pedestrian routing mode maintained for all waypoints
- Returns complete route with all intermediate points

### Data Storage
- Waypoints saved to localStorage with routes
- Persisted in recent searches
- Included in route metadata

### Marker Rendering
- Uses MapQuest Leaflet markers with custom colors
- Waypoints numbered sequentially (Stop 1, Stop 2, etc.)
- Popups show waypoint address on click
- Shadow effects for depth

## Future Enhancements (Optional)

### Route Optimization
- MapQuest supports `optimizeWaypoints` parameter
- Would reorder waypoints for shortest total distance
- Could add checkbox: "Optimize route order"

### Waypoint Dragging
- Allow reordering waypoints by drag-and-drop
- Update route dynamically as order changes

### Address Autocomplete
- Add suggestions as user types waypoint addresses
- Use MapQuest Search API for predictions

## Testing Checklist

- [x] Add waypoint with valid address
- [x] Remove waypoint
- [x] Create route with multiple waypoints
- [x] Map displays all waypoint markers
- [x] Route line connects all points
- [x] Save route with waypoints
- [x] Load saved route with waypoints
- [x] Empty waypoints filtered out
- [x] Backwards compatible (no waypoints still works)

## Design Consistency

✅ Maintains existing UI/UX design
✅ Uses orange gradient theme (#FC4C02)
✅ Matches input field styling
✅ Consistent button hover effects
✅ Follows existing spacing and layout patterns
