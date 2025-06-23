
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Save, Plus, Trash2, Upload } from 'lucide-react';

interface AmenitiesTabProps {
  onSave: (data: any) => void;
  clientId: number
}

const AmenitiesTab: React.FC<AmenitiesTabProps> = ({ onSave, clientId }) => {
  const [formData, setFormData] = useState({
    amenities_description: '',
    amenities_image: '',
    cta_title: '',
    cta_subtitle: '',
    amenities: [{
      title: '',
      description: '',
      category: '0',
      image_url: ''
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
      amenities: [...prev.amenities, { title: '', description: '', category: '0', image_url: '' }]
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

  const [data, setData] = React.useState({
    id: 0,
    amenities_description : '',
    amenities_image : '',
    cta_subtitle : '',
    cta_title : '',
  });
  const [essentialAmenities, setEssentialAmenities] = React.useState([]);
  const [recreationalAmenities, setRecreationalAmenities] = React.useState([]);
  const [specialAmenities, setSpeacialAmenities] = React.useState([]);

  useEffect(() => {
    const gatherAmenitiesData = async () => {
      await fetch(`https://bmlrxdnnxhawrhncbvoz.supabase.co/rest/v1/amenities?client_id=eq.${clientId}`, {
        method: 'GET',
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJtbHJ4ZG5ueGhhd3JobmNidm96Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTU1Mjc4NSwiZXhwIjoyMDY1MTI4Nzg1fQ.nxB9n8R4OjPaAdCYc8CooJYfx5OVLxcs_Xs3ZKW295I',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJtbHJ4ZG5ueGhhd3JobmNidm96Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTU1Mjc4NSwiZXhwIjoyMDY1MTI4Nzg1fQ.nxB9n8R4OjPaAdCYc8CooJYfx5OVLxcs_Xs3ZKW295I',
        }
      })
      .then(res => res.json())
      .then(res => {
        setData(res[0]);
      })
      } 
      
    gatherAmenitiesData();
  }, [clientId])

  useEffect(() => {
    const gatherEssentialAmenitiesData = async () => {
      await fetch(`https://bmlrxdnnxhawrhncbvoz.supabase.co/rest/v1/amenities_essential?amenities_id=eq.${amenitiesId}`, {
        method: 'GET',
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJtbHJ4ZG5ueGhhd3JobmNidm96Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTU1Mjc4NSwiZXhwIjoyMDY1MTI4Nzg1fQ.nxB9n8R4OjPaAdCYc8CooJYfx5OVLxcs_Xs3ZKW295I',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJtbHJ4ZG5ueGhhd3JobmNidm96Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTU1Mjc4NSwiZXhwIjoyMDY1MTI4Nzg1fQ.nxB9n8R4OjPaAdCYc8CooJYfx5OVLxcs_Xs3ZKW295I',
        }
      })
      .then(res => res.json())
      .then(res => {
        setEssentialAmenities(res);
      })
      } 
      
    gatherEssentialAmenitiesData();
    }, [data.id])

  useEffect(() => {
    const gatherRecreationalAmenitiesData = async () => {
      await fetch(`https://bmlrxdnnxhawrhncbvoz.supabase.co/rest/v1/amenities_activities?amenities_id=eq.${amenitiesId}`, {
        method: 'GET',
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJtbHJ4ZG5ueGhhd3JobmNidm96Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTU1Mjc4NSwiZXhwIjoyMDY1MTI4Nzg1fQ.nxB9n8R4OjPaAdCYc8CooJYfx5OVLxcs_Xs3ZKW295I',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJtbHJ4ZG5ueGhhd3JobmNidm96Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTU1Mjc4NSwiZXhwIjoyMDY1MTI4Nzg1fQ.nxB9n8R4OjPaAdCYc8CooJYfx5OVLxcs_Xs3ZKW295I',
        }
      })
      .then(res => res.json())
      .then(res => {
        setRecreationalAmenities(res);
      })
      } 
      
    gatherRecreationalAmenitiesData();
  }, [data.id])

  useEffect(() => {
    const gatherRecreationalAmenitiesData = async () => {
      await fetch(`https://bmlrxdnnxhawrhncbvoz.supabase.co/rest/v1/amenities_special?amenities_id=eq.${amenitiesId}`, {
        method: 'GET',
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJtbHJ4ZG5ueGhhd3JobmNidm96Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTU1Mjc4NSwiZXhwIjoyMDY1MTI4Nzg1fQ.nxB9n8R4OjPaAdCYc8CooJYfx5OVLxcs_Xs3ZKW295I',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJtbHJ4ZG5ueGhhd3JobmNidm96Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTU1Mjc4NSwiZXhwIjoyMDY1MTI4Nzg1fQ.nxB9n8R4OjPaAdCYc8CooJYfx5OVLxcs_Xs3ZKW295I',
        }
      })
      .then(res => res.json())
      .then(res => {
        setSpeacialAmenities(res);
      })
      } 
      
    gatherRecreationalAmenitiesData();
  }, [data.id])

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
            <Label htmlFor="amenities_image">Amenities Image</Label>
            <div className="mt-1 flex items-center space-x-2">
              <input
                id="amenities_image"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    updateField('amenities_image', file.name);
                  }
                }}
              />
              <Button
                variant="outline"
                onClick={() => document.getElementById('amenities_image')?.click()}
                className="flex items-center"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Amenities Image
              </Button>
              {data.amenities_image && (
                <span className="text-sm text-gray-600">{data.amenities_image}</span>
              )}
            </div>
          </div>
          <div>
            <Label htmlFor="amenities_description">Amenities Description</Label>
            <Textarea
              id="amenities_description"
              placeholder={data.amenities_description}
              value={formData.amenities_description}
              onChange={(e) => updateField('amenities_description', e.target.value)}
              className="mt-1"
            />
          </div>
        </CardContent>
      </Card>

      {/* Amenities List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-blue-700">Essential Amenities</CardTitle>
        </CardHeader>
        <CardContent>
          {essentialAmenities.map((amenity, index) => (
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
                  <Label>Amenity Picture</Label>
                  <div className="mt-1 flex items-center space-x-2">
                    <input
                      id={`amenity_main_image_${index}`}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          updateAmenity(index, 'image_url', file.name);
                        }
                      }}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => document.getElementById(`amenity_main_image_${index}`)?.click()}
                      className="flex items-center"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Image
                    </Button>
                    {amenity.image_url && (
                      <span className="text-sm text-gray-600">{amenity.image_url}</span>
                    )}
                  </div>
                </div>
                
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

      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-blue-700">Recreational Amenities</CardTitle>
        </CardHeader>
        <CardContent>
          {recreationalAmenities.map((amenity, index) => (
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
                  <Label>Amenity Picture</Label>
                  <div className="mt-1 flex items-center space-x-2">
                    <input
                      id={`amenity_main_image_${index}`}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          updateAmenity(index, 'image_url', file.name);
                        }
                      }}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => document.getElementById(`amenity_main_image_${index}`)?.click()}
                      className="flex items-center"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Image
                    </Button>
                    {amenity.image_url && (
                      <span className="text-sm text-gray-600">{amenity.image_url}</span>
                    )}
                  </div>
                </div>
                
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

      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-blue-700">Special Amenities</CardTitle>
        </CardHeader>
        <CardContent>
          {specialAmenities.map((amenity, index) => (
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
                  <Label>Amenity Picture</Label>
                  <div className="mt-1 flex items-center space-x-2">
                    <input
                      id={`amenity_main_image_${index}`}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          updateAmenity(index, 'image_url', file.name);
                        }
                      }}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => document.getElementById(`amenity_main_image_${index}`)?.click()}
                      className="flex items-center"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Image
                    </Button>
                    {amenity.image_url && (
                      <span className="text-sm text-gray-600">{amenity.image_url}</span>
                    )}
                  </div>
                </div>
                
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
              placeholder={data.cta_title}
              value={formData.cta_title}
              onChange={(e) => updateField('cta_title', e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="cta_subtitle">CTA Subtitle</Label>
            <Textarea
              id="cta_subtitle"
              placeholder={data.cta_subtitle}
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
