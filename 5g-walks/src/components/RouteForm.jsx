import { useState, useEffect } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { AlertCircle, PersonStanding, Footprints } from 'lucide-react';

export default function RouteForm({ onSubmit, initialData }) {
  // Ensure initialData is always an object, even if null or undefined is passed
  const safeInitialData = initialData || {};
  
  const [formData, setFormData] = useState({
    name: safeInitialData.name || '',
    description: safeInitialData.description || '',
    startLocation: safeInitialData.startLocation || '',
    endLocation: safeInitialData.endLocation || '',
    routeType: safeInitialData.routeType || 'walking',
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
        routeType: initialData.routeType || 'walking',
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
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

        <button type="submit" className="form-submit-btn">
          <span className="btn-text">Generate Route</span>
        </button>
      </form>
    </div>
  );
}
