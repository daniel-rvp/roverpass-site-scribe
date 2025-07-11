import React, { useEffect, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Save, Plus, Trash2, Upload } from 'lucide-react';

interface Amenity {
  id: number | null; // Null for new items
  title: string;
  description: string;
  category: string;
  image_url: string;
  client_id?: number; // Added client_id for consistency
}

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
    amenities: [] as Amenity[], // Initialize as empty array
  });

  const [originalAmenities, setOriginalAmenities] = useState<Amenity[]>([]);

  const generateTempId = () => Date.now() + Math.random();

  // Combine all amenity categories into one array for easier management
  const categoryOptions = [
    { value: '0', label: 'Essential' },
    { value: '1', label: 'Activity' },
    { value: '2', label: 'Special' }
  ];

  const supabaseHeaders = {
    'Content-Type': 'application/json',
    'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJtbHJ4ZG5ueGhhd3JobmNidm96Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTU1Mjc4NSwiZXhwIjoyMDY1MTI4Nzg1fQ.nxB9n8R4OjPaAdCYc8CooJYfx5OVLxcs_Xs3ZKW295I',
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJtbHJ4ZG5ueGhhd3JobmNidm96Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTU1Mjc4NSwiZXhwIjoyMDY1MTI4Nzg1fQ.nxB9n8R4OjPaAdCYc8CooJYfx5OVLxcs_Xs3ZKW295I',
    'Prefer': 'return=representation'
  };

const gatherData = useCallback(async () => {
    try {
      const mainAmenitiesResponse = await fetch(`https://bmlrxdnnxhawrhncbvoz.supabase.co/rest/v1/amenities?client_id=eq.${clientId}`, {
        method: 'GET',
        headers: supabaseHeaders,
      });
      const fetchedMainAmenities = await mainAmenitiesResponse.json();

      // Assuming fetchedMainAmenities will always return one object or none
      const initialMainData = fetchedMainAmenities[0] || {
        id: null, // Ensure id is included and can be null initially
        amenities_description: '',
        amenities_image: '',
        cta_title: '',
        cta_subtitle: '',
      };

      setFormData(prev => ({
        ...prev,
        ...initialMainData, // Spread the main amenities data
      }));

    } catch (error) {
      console.error("Error gathering initial data:", error);
    }
  }, [clientId]); // Dependencies for useCallback

  useEffect(() => {
    gatherData();
  }, [gatherData]); // Dependencies for useEffect

  // Fetch essential amenities, now dependent on data.id
  useEffect(() => {
    const gatherEssentialAmenitiesData = async () => {
      if (formData.id) { // Only fetch if data.id is available
        await fetch(`https://bmlrxdnnxhawrhncbvoz.supabase.co/rest/v1/amenities_essential?amenities_id=eq.${formData.id}`, {
          method: 'GET',
          headers: supabaseHeaders,
        })
          .then(res => res.json())
          .then(res => {
            setFormData(prev => ({
              ...prev,
              amenities: res
            }));
            setOriginalAmenities(res);
          });
      }
    };
    gatherEssentialAmenitiesData();
  }, [formData.id]);

  // Fetch recreational amenities, now dependent on data.id
  useEffect(() => {
    const gatherRecreationalAmenitiesData = async () => {
      if (formData.id) { // Only fetch if data.id is available
        await fetch(`https://bmlrxdnnxhawrhncbvoz.supabase.co/rest/v1/amenities_activities?amenities_id=eq.${formData.id}`, {
          method: 'GET',
          headers: supabaseHeaders,
        })
          .then(res => res.json())
          .then(res => {
            // Assuming you want to append these to the existing amenities
            setFormData(prev => ({
              ...prev,
              amenities: [...prev.amenities, ...res]
            }));
            setOriginalAmenities(prev => [...prev, ...res]);
          });
      }
    };
    gatherRecreationalAmenitiesData();
  }, [formData.id]);

  // Fetch special amenities, now dependent on data.id
  useEffect(() => {
    const gatherSpecialAmenitiesData = async () => {
      if (formData.id) { // Only fetch if data.id is available
        await fetch(`https://bmlrxdnnxhawrhncbvoz.supabase.co/rest/v1/amenities_special?amenities_id=eq.${formData.id}`, {
          method: 'GET',
          headers: supabaseHeaders,
        })
          .then(res => res.json())
          .then(res => {
            // Assuming you want to append these to the existing amenities
            setFormData(prev => ({
              ...prev,
              amenities: [...prev.amenities, ...res]
            }));
            setOriginalAmenities(prev => [...prev, ...res]);
          });
      }
    };
    gatherSpecialAmenitiesData();
  }, [formData.id]);
  useEffect(() => {
    gatherData();
  }, [gatherData]); // Dependencies for useEffect

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateAmenity = (id: number | null, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    }));
  };

  const addAmenity = () => {
    setFormData(prev => ({
      ...prev,
      amenities: [...prev.amenities, { id: generateTempId(), title: '', description: '', category: '0', image_url: '', client_id: clientId }]
    }));
  };

  const removeAmenity = (id: number | null) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.filter((item) => item.id !== id)
    }));
  };

  const handleSave = async () => {
    try {
      const allPromises: Promise<any>[] = [];

      // --- Handle Main Amenities Data (assuming there's only one entry per client) ---
      // For simplicity, we'll just PATCH if data exists, otherwise POST.
      const mainAmenitiesToSave = {
        amenities_description: formData.amenities_description,
        amenities_image: formData.amenities_image,
        cta_title: formData.cta_title,
        cta_subtitle: formData.cta_subtitle,
        client_id: clientId // Ensure client_id is included
      };

      // Check if main amenities record exists for this client_id
      const existingMainAmenity = (await (await fetch(`https://bmlrxdnnxhawrhncbvoz.supabase.co/rest/v1/amenities?client_id=eq.${clientId}`, {
        method: 'GET',
        headers: supabaseHeaders,
      })).json())[0];

      if (existingMainAmenity) {
        allPromises.push(
          fetch(`https://bmlrxdnnxhawrhncbvoz.supabase.co/rest/v1/amenities?id=eq.${existingMainAmenity.id}`, {
            method: 'PATCH',
            headers: supabaseHeaders,
            body: JSON.stringify(mainAmenitiesToSave)
          }).then(res => res.json())
        );
      } else {
        allPromises.push(
          fetch(`https://bmlrxdnnxhawrhncbvoz.supabase.co/rest/v1/amenities`, {
            method: 'POST',
            headers: supabaseHeaders,
            body: JSON.stringify(mainAmenitiesToSave)
          }).then(res => res.json())
        );
      }

      // --- Handle Amenity Items ---
      const amenityIdsToRemove = originalAmenities
        .filter(originalAmenity => !formData.amenities.some(currentAmenity => currentAmenity.id === originalAmenity.id))
        .map(amenity => amenity.id);

      for (const id of amenityIdsToRemove) {
        if (id !== null) {
          allPromises.push(
            fetch(`https://bmlrxdnnxhawrhncbvoz.supabase.co/rest/v1/amenity_items?id=eq.${id}`, {
              method: 'DELETE',
              headers: supabaseHeaders,
            }).then(res => res.json())
          );
        }
      }

      for (const amenity of formData.amenities) {
        if (amenity.id && originalAmenities.some(orig => orig.id === amenity.id)) {
          // Check for updates
          const originalAmenity = originalAmenities.find(orig => orig.id === amenity.id);
          if (originalAmenity && (originalAmenity.title !== amenity.title || originalAmenity.description !== amenity.description || originalAmenity.category !== amenity.category || originalAmenity.image_url !== amenity.image_url)) {
            allPromises.push(
              fetch(`https://bmlrxdnnxhawrhncbvoz.supabase.co/rest/v1/amenity_items?id=eq.${amenity.id}`, {
                method: 'PATCH',
                headers: supabaseHeaders,
                body: JSON.stringify({ title: amenity.title, description: amenity.description, category: amenity.category, image_url: amenity.image_url, client_id: clientId })
              }).then(res => res.json())
            );
          }
        } else {
          // New amenity (has temporary ID or no ID)
          allPromises.push(
            fetch(`https://bmlrxdnnxhawrhncbvoz.supabase.co/rest/v1/amenity_items`, {
              method: 'POST',
              headers: supabaseHeaders,
              body: JSON.stringify({ title: amenity.title, description: amenity.description, category: amenity.category, image_url: amenity.image_url, client_id: clientId })
            }).then(res => res.json())
          );
        }
      }

      await Promise.all(allPromises);
      await gatherData(); // Re-fetch to get actual IDs for new items and sync state

      onSave(formData); // Notify parent component of save
    } catch (error) {
      console.error("Error saving data:", error);
    }
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
          <CardTitle className="text-lg ">Header Section</CardTitle>
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
              {formData.amenities_image && ( // Use formData here
                <span className="text-sm text-gray-600">{formData.amenities_image}</span>
              )}
            </div>
          </div>
          <div>
            <Label htmlFor="amenities_description">Amenities Description</Label>
            <Textarea
              id="amenities_description"
              placeholder="Enter amenities description"
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
          <CardTitle className="text-lg ">Amenities List</CardTitle>
        </CardHeader>
        <CardContent>
          {formData.amenities.map((amenity, index) => ( // Iterate through formData.amenities
            <div key={`${amenity.id}-${index}`} className="border-2 border-blue-200 p-4 rounded-lg mt-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-blue-800">Amenity {index + 1}</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeAmenity(amenity.id!)}
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
                      id={`amenity_image_${amenity.id}`} // Use amenity.id for unique ID
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          updateAmenity(amenity.id!, 'image_url', file.name);
                        }
                      }}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => document.getElementById(`amenity_image_${amenity.id}`)?.click()}
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
                    onChange={(e) => updateAmenity(amenity.id!, 'title', e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label>Description</Label>
                  <Textarea
                    placeholder="2-line Description (max 180 characters)"
                    value={amenity.description}
                    onChange={(e) => updateAmenity(amenity.id!, 'description', e.target.value)}
                    className="mt-1"
                    maxLength={180}
                  />
                  <p className="text-sm text-gray-500 mt-1">{amenity.description.length}/180 characters</p>
                </div>

                <div>
                  <Label>Category</Label>
                  <Select value={amenity.category} onValueChange={(value) => updateAmenity(amenity.id!, 'category', value)}>
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
          <CardTitle className="text-lg ">Call to Action</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="cta_title">CTA Title</Label>
            <Textarea
              id="cta_title"
              placeholder="Enter CTA title"
              value={formData.cta_title}
              onChange={(e) => updateField('cta_title', e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="cta_subtitle">CTA Subtitle</Label>
            <Textarea
              id="cta_subtitle"
              placeholder="Enter CTA subtitle"
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