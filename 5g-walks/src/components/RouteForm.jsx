import { useState, useEffect } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { AlertCircle, PersonStanding, Footprints, Plus, X } from 'lucide-react';
import { getPreferences, updatePreferences } from '../lib/localStorage';
import { UNIT_TYPES, getUnitLabel } from '../lib/units';

export default function RouteForm({ onSubmit, initialData }) {
  // Ensure initialData is always an object, even if null or undefined is passed
  const safeInitialData = initialData || {};
  
  // Load preferences
  const preferences = getPreferences();
  
  const [formData, setFormData] = useState({
    name: safeInitialData.name || '',
    description: safeInitialData.description || '',
    startLocation: safeInitialData.startLocation || '',
    endLocation: safeInitialData.endLocation || '',
    routeType: safeInitialData.routeType || preferences.routeType || 'walking',
    units: safeInitialData.units || preferences.units || UNIT_TYPES.METRIC,
    waypoints: safeInitialData.waypoints || [],
  });

  const [validationErrors, setValidationErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Update form when initialData changes (e.g., navigating from featured routes)
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        description: initialData.description || '',
        startLocation: initialData.startLocation || '',
        endLocation: initialData.endLocation || '',
        routeType: initialData.routeType || preferences.routeType || 'walking',
        units: initialData.units || preferences.units || UNIT_TYPES.METRIC,
        waypoints: initialData.waypoints || [],
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    // Save unit preference when changed
    if (name === 'units') {
      updatePreferences({ units: value });
    }
    
    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleBlur = (fieldName) => {
    setTouched(prev => ({ ...prev, [fieldName]: true }));
    validateField(fieldName, formData[fieldName]);
  };

  const validateField = (fieldName, value) => {
    let error = '';
    
    switch (fieldName) {
      case 'name':
        if (!value.trim()) {
          error = 'Route name is required';
        } else if (value.trim().length < 3) {
          error = 'Route name must be at least 3 characters';
        }
        break;
      case 'startLocation':
        if (!value.trim()) {
          error = 'Start location is required';
        }
        break;
      case 'endLocation':
        if (!value.trim()) {
          error = 'End location is required';
        }
        break;
    }
    
    setValidationErrors(prev => ({ ...prev, [fieldName]: error }));
    return !error;
  };

  const addWaypoint = () => {
    setFormData(prev => ({
      ...prev,
      waypoints: [...prev.waypoints, ''],
    }));
  };

  const removeWaypoint = (index) => {
    setFormData(prev => ({
      ...prev,
      waypoints: prev.waypoints.filter((_, i) => i !== index),
    }));
  };

  const updateWaypoint = (index, value) => {
    setFormData(prev => ({
      ...prev,
      waypoints: prev.waypoints.map((wp, i) => i === index ? value : wp),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Mark all fields as touched
    setTouched({
      name: true,
      startLocation: true,
      endLocation: true,
    });
    
    // Validate all fields
    const isNameValid = validateField('name', formData.name);
    const isStartValid = validateField('startLocation', formData.startLocation);
    const isEndValid = validateField('endLocation', formData.endLocation);
    
    // Only submit if all fields are valid
    if (isNameValid && isStartValid && isEndValid) {
      onSubmit(formData);
    }
  };

  return (
    <div className="route-form">
      <div className="route-form-header">
        <h2 className="route-form-title">Plan Your Route</h2>
        <p className="route-form-subtitle">
          Create your perfect walking or running experience
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="route-form-content">
        <div className="form-section">
          <label htmlFor="name" className="form-label">
            <span className="label-text">Route Name</span>
            <span className="label-required">*</span>
          </label>
          <Input
            id="name"
            name="name"
            type="text"
            placeholder="e.g., Morning Walk to Rizal Park"
            value={formData.name}
            onChange={handleChange}
            onBlur={() => handleBlur('name')}
            className={`form-input ${validationErrors.name && touched.name ? 'input-error' : ''}`}
          />
          {validationErrors.name && touched.name && (
            <div className="validation-error">
              <AlertCircle size={16} />
              <span>{validationErrors.name}</span>
            </div>
          )}
        </div>

        <div className="form-section">
          <label htmlFor="description" className="form-label">
            <span className="label-text">Description</span>
            <span className="label-optional">(optional)</span>
          </label>
          <Input
            id="description"
            name="description"
            type="text"
            placeholder="Describe your route..."
            value={formData.description}
            onChange={handleChange}
            className="form-input"
          />
        </div>

        <div className="form-divider"></div>

        <div className="form-section">
          <label htmlFor="startLocation" className="form-label">
            <span className="label-text">Start Location</span>
            <span className="label-required">*</span>
          </label>
          <Input
            id="startLocation"
            name="startLocation"
            type="text"
            placeholder="e.g., University of Santo Tomas, Manila"
            value={formData.startLocation}
            onChange={handleChange}
            onBlur={() => handleBlur('startLocation')}
            className={`form-input ${validationErrors.startLocation && touched.startLocation ? 'input-error' : ''}`}
          />
          {validationErrors.startLocation && touched.startLocation && (
            <div className="validation-error">
              <AlertCircle size={16} />
              <span>{validationErrors.startLocation}</span>
            </div>
          )}
        </div>

        <div className="form-section">
          <label htmlFor="endLocation" className="form-label">
            <span className="label-text">End Location</span>
            <span className="label-required">*</span>
          </label>
          <Input
            id="endLocation"
            name="endLocation"
            type="text"
            placeholder="e.g., Rizal Park, Manila"
            value={formData.endLocation}
            onChange={handleChange}
            onBlur={() => handleBlur('endLocation')}
            className={`form-input ${validationErrors.endLocation && touched.endLocation ? 'input-error' : ''}`}
          />
          {validationErrors.endLocation && touched.endLocation && (
            <div className="validation-error">
              <AlertCircle size={16} />
              <span>{validationErrors.endLocation}</span>
            </div>
          )}
        </div>

        {/* Waypoints Section */}
        <div className="form-section">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <label className="form-label" style={{ margin: 0 }}>
              <span className="label-text">Stops Along the Way</span>
              <span className="label-optional" style={{ marginLeft: '0.5rem' }}>(optional)</span>
            </label>
            <button
              type="button"
              onClick={addWaypoint}
              style={{
                background: 'rgba(252, 76, 2, 0.1)',
                color: '#FC4C02',
                border: 'none',
                padding: '0.5rem 0.875rem',
                borderRadius: '8px',
                fontSize: '0.875rem',
                fontWeight: 500,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.375rem',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => e.target.style.background = 'rgba(252, 76, 2, 0.15)'}
              onMouseLeave={(e) => e.target.style.background = 'rgba(252, 76, 2, 0.1)'}
            >
              <Plus size={16} />
              Add Stop
            </button>
          </div>

          {formData.waypoints.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {formData.waypoints.map((waypoint, index) => (
                <div key={index} style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1, minWidth: '0' }}>
                    <Input
                      type="text"
                      placeholder={`Stop ${index + 1} (e.g., Manila City Hall)`}
                      value={waypoint}
                      onChange={(e) => updateWaypoint(index, e.target.value)}
                      className="form-input"
                      style={{
                        height: '56px',
                        fontSize: '16px',
                        padding: '1rem 1.25rem',
                        width: '100%',
                      }}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeWaypoint(index)}
                    style={{
                      background: 'rgba(239, 68, 68, 0.1)',
                      color: '#dc2626',
                      border: 'none',
                      padding: '0.875rem',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.2s',
                      minHeight: '56px',
                      minWidth: '56px',
                      flexShrink: 0,
                    }}
                    onMouseEnter={(e) => e.target.style.background = 'rgba(239, 68, 68, 0.15)'}
                    onMouseLeave={(e) => e.target.style.background = 'rgba(239, 68, 68, 0.1)'}
                    aria-label={`Remove stop ${index + 1}`}
                  >
                    <X size={22} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {formData.waypoints.length === 0 && (
            <p style={{ fontSize: '0.875rem', color: '#999', fontStyle: 'italic', margin: 0 }}>
              No stops added. Click "Add Stop" to include waypoints in your route.
            </p>
          )}
        </div>

        <div className="form-divider"></div>

        <div className="form-section">
          <label className="form-label">
            <span className="label-text">Activity Type</span>
            <span className="label-required">*</span>
          </label>
          <div className="radio-group">
            <label className={`radio-option ${formData.routeType === 'walking' ? 'active' : ''}`}>
              <input
                type="radio"
                name="routeType"
                value="walking"
                checked={formData.routeType === 'walking'}
                onChange={handleChange}
              />
              <div className="radio-content">
                <PersonStanding size={20} />
                <span>Walking</span>
              </div>
            </label>
            <label className={`radio-option ${formData.routeType === 'running' ? 'active' : ''}`}>
              <input
                type="radio"
                name="routeType"
                value="running"
                checked={formData.routeType === 'running'}
                onChange={handleChange}
              />
              <div className="radio-content">
                <Footprints size={20} />
                <span>Running</span>
              </div>
            </label>
          </div>
        </div>

        <div className="form-section">
          <label htmlFor="units" className="form-label">
            <span className="label-text">Distance Unit</span>
          </label>
          <select
            id="units"
            name="units"
            value={formData.units}
            onChange={handleChange}
            className="form-input"
            style={{ cursor: 'pointer' }}
          >
            <option value={UNIT_TYPES.METRIC}>{getUnitLabel(UNIT_TYPES.METRIC)}</option>
            <option value={UNIT_TYPES.IMPERIAL}>{getUnitLabel(UNIT_TYPES.IMPERIAL)}</option>
            <option value={UNIT_TYPES.METERS}>{getUnitLabel(UNIT_TYPES.METERS)}</option>
          </select>
        </div>

        <button type="submit" className="form-submit-btn">
          <span className="btn-text">Generate Route</span>
        </button>
      </form>
    </div>
  );
}
