
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Save, Plus, Trash2 } from 'lucide-react';

interface AmenitiesTabProps {
  onSave: (data: any) => void;
}

const AmenitiesTab: React.FC<AmenitiesTabProps> = ({ onSave }) => {
  const [formData, setFormData] = useState({
    amenities_description: '',
    amenities_image: '',
    cta_title: '',
    cta_subtitle: '',
    amenities: [{
      title: '',
      description: '',
      category: '0'
    }]
  });

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateAmenity = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const addAmenity = () => {
    setFormData(prev => ({
      ...prev,
      amenities: [...prev.amenities, { title: '', description: '', category: '0' }]
    }));
  };

  const removeAmenity = (index: number) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.filter((_, i) => i !== index)
    }));
  };

  const categoryOptions = [
    { value: '0', label: 'Essential' },
    { value: '1', label: 'Activity' },
    { value: '2', label: 'Special' }
  ];

  const handleSave = () => {
    onSave(formData);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Amenities Page Content</h2>
        <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
      </div>

      {/* Header Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-blue-700">Header Section</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="amenities_description">Amenities Description</Label>
            <Textarea
              id="amenities_description"
              placeholder="Description for the amenities page"
              value={formData.amenities_description}
              onChange={(e) => updateField('amenities_description', e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="amenities_image">Amenities Image</Label>
            <Textarea
              id="amenities_image"
              placeholder="Amenities image URL or description"
              value={formData.amenities_image}
              onChange={(e) => updateField('amenities_image', e.target.value)}
              className="mt-1"
            />
          </div>
        </CardContent>
      </Card>

      {/* Amenities List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-blue-700">Amenities List</CardTitle>
        </CardHeader>
        <CardContent>
          {formData.amenities.map((amenity, index) => (
            <div key={index} className="border-2 border-blue-200 p-4 rounded-lg mt-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-blue-800">Amenity {index + 1}</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeAmenity(index)}
                  className="text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label>Amenity Title</Label>
                  <Textarea
                    placeholder="Amenity Name (Title style)"
                    value={amenity.title}
                    onChange={(e) => updateAmenity(index, 'title', e.target.value)}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label>Description</Label>
                  <Textarea
                    placeholder="2-line Description (max 180 characters)"
                    value={amenity.description}
                    onChange={(e) => updateAmenity(index, 'description', e.target.value)}
                    className="mt-1"
                    maxLength={180}
                  />
                  <p className="text-sm text-gray-500 mt-1">{amenity.description.length}/180 characters</p>
                </div>

                <div>
                  <Label>Category</Label>
                  <Select value={amenity.category} onValueChange={(value) => updateAmenity(index, 'category', value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categoryOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          ))}
          
          <Button
            variant="outline"
            onClick={addAmenity}
            className="mt-4"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Amenity
          </Button>
        </CardContent>
      </Card>

      {/* Call to Action Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-blue-700">Call to Action</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="cta_title">CTA Title</Label>
            <Textarea
              id="cta_title"
              placeholder="Title to create interest in the park"
              value={formData.cta_title}
              onChange={(e) => updateField('cta_title', e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="cta_subtitle">CTA Subtitle</Label>
            <Textarea
              id="cta_subtitle"
              placeholder="One-line call to action encouraging bookings or relaxing at the park"
              value={formData.cta_subtitle}
              onChange={(e) => updateField('cta_subtitle', e.target.value)}
              className="mt-1"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AmenitiesTab;
