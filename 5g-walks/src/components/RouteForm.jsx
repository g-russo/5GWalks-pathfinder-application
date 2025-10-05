import { useState, useEffect } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

export default function RouteForm({ onSubmit, initialData = {} }) {
  const [formData, setFormData] = useState({
    name: initialData.name || '',
    description: initialData.description || '',
    startLocation: initialData.startLocation || '',
    endLocation: initialData.endLocation || '',
    routeType: initialData.routeType || 'walking',
  });

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
    <Card className="route-form-card">
      <CardHeader>
        <CardTitle>Create New Route</CardTitle>
        <CardDescription>
          Enter the details for your walking route
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-group">
            <label htmlFor="name" className="block text-sm font-medium mb-2">
              Route Name
            </label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="e.g., Morning Park Walk"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description" className="block text-sm font-medium mb-2">
              Description
            </label>
            <Input
              id="description"
              name="description"
              type="text"
              placeholder="Describe your route..."
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="startLocation" className="block text-sm font-medium mb-2">
              Start Location
            </label>
            <Input
              id="startLocation"
              name="startLocation"
              type="text"
              placeholder="Enter starting address"
              value={formData.startLocation}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="endLocation" className="block text-sm font-medium mb-2">
              End Location
            </label>
            <Input
              id="endLocation"
              name="endLocation"
              type="text"
              placeholder="Enter destination address"
              value={formData.endLocation}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="routeType" className="block text-sm font-medium mb-2">
              Route Type
            </label>
            <select
              id="routeType"
              name="routeType"
              value={formData.routeType}
              onChange={handleChange}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="walking">Walking</option>
              <option value="pedestrian">Pedestrian</option>
              <option value="shortest">Shortest Route</option>
              <option value="fastest">Fastest Route</option>
            </select>
          </div>

          <Button type="submit" className="w-full">
            Generate Route
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
