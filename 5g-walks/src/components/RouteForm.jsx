import { useState, useEffect } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

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
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
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
            placeholder="e.g., Morning Park Walk"
            value={formData.name}
            onChange={handleChange}
            className="form-input"
            required
          />
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
            <span className="label-text">📍 Start Location</span>
            <span className="label-required">*</span>
          </label>
          <Input
            id="startLocation"
            name="startLocation"
            type="text"
            placeholder="e.g., Times Square, New York, NY"
            value={formData.startLocation}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>

        <div className="form-section">
          <label htmlFor="endLocation" className="form-label">
            <span className="label-text">🎯 End Location</span>
            <span className="label-required">*</span>
          </label>
          <Input
            id="endLocation"
            name="endLocation"
            type="text"
            placeholder="e.g., Central Park, New York, NY"
            value={formData.endLocation}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>

        <div className="form-divider"></div>

        <div className="form-section">
          <label htmlFor="routeType" className="form-label">
            <span className="label-text">Activity Type</span>
            <span className="label-required">*</span>
          </label>
          <select
            id="routeType"
            name="routeType"
            value={formData.routeType}
            onChange={handleChange}
            className="form-select"
          >
            <option value="walking">🚶 Walking</option>
            <option value="running">🏃 Running</option>
          </select>
        </div>

        <button type="submit" className="form-submit-btn">
          <span className="btn-icon">🗺️</span>
          <span className="btn-text">Generate Route</span>
          <span className="btn-arrow">→</span>
        </button>
      </form>
    </div>
  );
}
