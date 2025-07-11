import React, { useEffect, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Save, Plus, Trash2, Upload } from 'lucide-react';

// Define interfaces for better type safety and clarity
interface Amenity {
  id: number | null;
  title: string;
  icon: string;
  about_id?: number; // Optional, will be set when linked to main 'about' record
}

interface Accommodation {
  id: number | null;
  title: string;
  subtitle: string;
  image_url: string;
  about_id?: number; // Optional, will be set when linked to main 'about' record
}

interface AboutFormData {
  id: number | null; // Added to store the main 'about' record ID
  hero_image: string;
  hero_title: string;
  hero_subtitle: string;
  intro_title: string;
  intro_subtitle: string;
  amenities: Amenity[];
  accommodations: Accommodation[];
  cta_title: string;
  cta_subtitle: string;
}

interface AboutTabProps {
  onSave: (data: any) => void;
  clientId: number;
}

const AboutTab: React.FC<AboutTabProps> = ({ onSave, clientId }) => {
  const [formData, setFormData] = useState<AboutFormData>({
    id: null,
    hero_image: '',
    hero_title: '',
    hero_subtitle: '',
    intro_title: '',
    intro_subtitle: '',
    amenities: [],
    accommodations: [],
    cta_title: '',
    cta_subtitle: ''
  });

  // Store original data to compare changes for PATCH/DELETE operations
  const [originalAmenities, setOriginalAmenities] = useState<Amenity[]>([]);
  const [originalAccommodations, setOriginalAccommodations] = useState<Accommodation[]>([]);

  // Supabase headers
  const supabaseHeaders = {
    'Content-Type': 'application/json',
    'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJtbHJ4ZG5ueGhhd3JobmNidm96Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTU1Mjc4NSwiZXhwIjoyMDY1MTI4Nzg1fQ.nxB9n8R4OjPaAdCYc8CooJYfx5OVLxcs_Xs3ZKW295I',
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJtbHJ4ZG5ueGhhd3JobmNidm96Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTU1Mjc4NSwiZXhwIjoyMDY1MTI4Nzg1fQ.nxB9n8R4OjPaAdCYc8CooJYfx5OVLxcs_Xs3ZKW295I',
    'Prefer': 'return=representation'
  };

  // Helper to generate temporary IDs for new items before they get real IDs from the DB
  const generateTempId = () => Date.now() + Math.random();

  // Unified data gathering function
  const gatherData = useCallback(async () => {
    try {
      // Fetch main 'about' data
      const mainAboutResponse = await fetch(`https://bmlrxdnnxhawrhncbvoz.supabase.co/rest/v1/about?client_id=eq.${clientId}`, {
        method: 'GET',
        headers: supabaseHeaders,
      });
      const fetchedMainAbout = await mainAboutResponse.json();

      const initialMainData = fetchedMainAbout[0] || {
        id: null,
        hero_image: '',
        hero_title: '',
        hero_subtitle: '',
        intro_title: '',
        intro_subtitle: '',
        cta_title: '',
        cta_subtitle: ''
      };

      let fetchedAmenities: Amenity[] = [];
      let fetchedAccommodations: Accommodation[] = [];

      // If main 'about' data exists, fetch associated amenities and accommodations
      if (initialMainData.id) {
        const [amenitiesResponse, accommodationsResponse] = await Promise.all([
          fetch(`https://bmlrxdnnxhawrhncbvoz.supabase.co/rest/v1/about_amenity?about_id=eq.${initialMainData.id}`, {
            method: 'GET',
            headers: supabaseHeaders,
          }),
          fetch(`https://bmlrxdnnxhawrhncbvoz.supabase.co/rest/v1/about_accommodation?about_id=eq.${initialMainData.id}`, {
            method: 'GET',
            headers: supabaseHeaders,
          })
        ]);

        fetchedAmenities = await amenitiesResponse.json();
        fetchedAccommodations = await accommodationsResponse.json();
      }

      setFormData({
        ...initialMainData,
        amenities: fetchedAmenities,
        accommodations: fetchedAccommodations,
      });

      setOriginalAmenities(fetchedAmenities);
      setOriginalAccommodations(fetchedAccommodations);

    } catch (error) {
      console.error("Error gathering initial data:", error);
    }
  }, [clientId]);

  // Use useEffect to call gatherData on component mount and when clientId changes
  useEffect(() => {
    gatherData();
  }, [gatherData]);

  // Update main form fields
  const updateField = (field: keyof AboutFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Update items within nested lists (amenities, accommodations)
  const updateListItem = (listName: 'amenities' | 'accommodations', id: number | null, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [listName]: prev[listName].map((item: any) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    }));
  };

  // Add new item to a nested list
  const addListItem = (listName: 'amenities' | 'accommodations', template: any) => {
    setFormData(prev => ({
      ...prev,
      [listName]: [...prev[listName], { id: generateTempId(), ...template }]
    }));
  };

  // Remove item from a nested list
  const removeListItem = (listName: 'amenities' | 'accommodations', id: number | null) => {
    setFormData(prev => ({
      ...prev,
      [listName]: prev[listName].filter((item: any) => item.id !== id)
    }));
  };

  const handleSave = async () => {
    try {
      const allPromises: Promise<any>[] = [];

      // --- Handle Main About Data ---
      const mainAboutToSave = {
        hero_image: formData.hero_image,
        hero_title: formData.hero_title,
        hero_subtitle: formData.hero_subtitle,
        intro_title: formData.intro_title,
        intro_subtitle: formData.intro_subtitle,
        cta_title: formData.cta_title,
        cta_subtitle: formData.cta_subtitle,
        client_id: clientId // Link to client
      };

      let currentAboutId = formData.id;

      if (formData.id) {
        // Update existing main 'about' record
        allPromises.push(
          fetch(`https://bmlrxdnnxhawrhncbvoz.supabase.co/rest/v1/about?id=eq.${formData.id}`, {
            method: 'PATCH',
            headers: supabaseHeaders,
            body: JSON.stringify(mainAboutToSave)
          }).then(res => res.json())
        );
      } else {
        // Create new main 'about' record
        const response = await fetch(`https://bmlrxdnnxhawrhncbvoz.supabase.co/rest/v1/about`, {
          method: 'POST',
          headers: supabaseHeaders,
          body: JSON.stringify(mainAboutToSave)
        });
        const newMainAbout = await response.json();
        if (newMainAbout && newMainAbout.length > 0) {
          currentAboutId = newMainAbout[0].id;
          setFormData(prev => ({ ...prev, id: currentAboutId })); // Update formData with new ID
        } else {
          throw new Error("Failed to create main about record.");
        }
      }

      // Ensure currentAboutId is available for nested items
      if (!currentAboutId) {
        console.error("Main About ID not available for saving nested items.");
        return;
      }

      // --- Handle Amenities ---
      const amenityIdsToRemove = originalAmenities
        .filter(originalAmenity => !formData.amenities.some(currentAmenity => currentAmenity.id === originalAmenity.id))
        .map(amenity => amenity.id);

      for (const id of amenityIdsToRemove) {
        if (id !== null) {
          allPromises.push(
            fetch(`https://bmlrxdnnxhawrhncbvoz.supabase.co/rest/v1/about_amenity?id=eq.${id}`, {
              method: 'DELETE',
              headers: supabaseHeaders,
            }).then(res => res.json())
          );
        }
      }

      for (const amenity of formData.amenities) {
        const amenityToSave = {
          title: amenity.title,
          icon: amenity.icon,
          about_id: currentAboutId
        };

        if (amenity.id && originalAmenities.some(orig => orig.id === amenity.id)) {
          // Existing amenity: check for updates
          const originalAmenity = originalAmenities.find(orig => orig.id === amenity.id);
          if (originalAmenity && (
            originalAmenity.title !== amenity.title ||
            originalAmenity.icon !== amenity.icon
          )) {
            allPromises.push(
              fetch(`https://bmlrxdnnxhawrhncbvoz.supabase.co/rest/v1/about_amenity?id=eq.${amenity.id}`, {
                method: 'PATCH',
                headers: supabaseHeaders,
                body: JSON.stringify(amenityToSave)
              }).then(res => res.json())
            );
          }
        } else {
          // New amenity
          allPromises.push(
            fetch(`https://bmlrxdnnxhawrhncbvoz.supabase.co/rest/v1/about_amenity`, {
              method: 'POST',
              headers: supabaseHeaders,
              body: JSON.stringify(amenityToSave)
            }).then(res => res.json())
          );
        }
      }

      // --- Handle Accommodations ---
      const accommodationIdsToRemove = originalAccommodations
        .filter(originalAcc => !formData.accommodations.some(currentAcc => currentAcc.id === originalAcc.id))
        .map(acc => acc.id);

      for (const id of accommodationIdsToRemove) {
        if (id !== null) {
          allPromises.push(
            fetch(`https://bmlrxdnnxhawrhncbvoz.supabase.co/rest/v1/about_accommodation?id=eq.${id}`, {
              method: 'DELETE',
              headers: supabaseHeaders,
            }).then(res => res.json())
          );
        }
      }

      for (const accommodation of formData.accommodations) {
        const accommodationToSave = {
          title: accommodation.title,
          subtitle: accommodation.subtitle,
          image_url: accommodation.image_url,
          about_id: currentAboutId
        };

        if (accommodation.id && originalAccommodations.some(orig => orig.id === accommodation.id)) {
          // Existing accommodation: check for updates
          const originalAccommodation = originalAccommodations.find(orig => orig.id === accommodation.id);
          if (originalAccommodation && (
            originalAccommodation.title !== accommodation.title ||
            originalAccommodation.subtitle !== accommodation.subtitle ||
            originalAccommodation.image_url !== accommodation.image_url
          )) {
            allPromises.push(
              fetch(`https://bmlrxdnnxhawrhncbvoz.supabase.co/rest/v1/about_accommodation?id=eq.${accommodation.id}`, {
                method: 'PATCH',
                headers: supabaseHeaders,
                body: JSON.stringify(accommodationToSave)
              }).then(res => res.json())
            );
          }
        } else {
          // New accommodation
          allPromises.push(
            fetch(`https://bmlrxdnnxhawrhncbvoz.supabase.co/rest/v1/about_accommodation`, {
              method: 'POST',
              headers: supabaseHeaders,
              body: JSON.stringify(accommodationToSave)
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
        <h2 className="text-2xl font-bold text-slate-800">About Page Content</h2>
        <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
      </div>

      {/* Hero Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg ">Hero Section</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="hero_image">Hero Image</Label>
            <div className="mt-1 flex items-center space-x-2">
              <input
                id="hero_image"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    updateField('hero_image', file.name);
                  }
                }}
              />
              <Button
                variant="outline"
                onClick={() => document.getElementById('hero_image')?.click()}
                className="flex items-center"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Hero Image
              </Button>
              {formData.hero_image && (
                <span className="text-sm text-gray-600">{formData.hero_image}</span>
              )}
            </div>
          </div>
          <div>
            <Label htmlFor="hero_title">Hero Title</Label>
            <Textarea
              id="hero_title"
              placeholder="Enter hero title"
              value={formData.hero_title}
              onChange={(e) => updateField('hero_title', e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="hero_subtitle">Hero Subtitle</Label>
            <Textarea
              id="hero_subtitle"
              placeholder="Enter hero subtitle"
              value={formData.hero_subtitle}
              onChange={(e) => updateField('hero_subtitle', e.target.value)}
              className="mt-1"
            />
          </div>
        </CardContent>
      </Card>

      {/* Introduction Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg ">Introduction Section</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="intro_title">Introduction Title</Label>
            <Textarea
              id="intro_title"
              placeholder="Enter introduction title"
              value={formData.intro_title}
              onChange={(e) => updateField('intro_title', e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="intro_subtitle">Introduction Subtitle</Label>
            <Textarea
              id="intro_subtitle"
              placeholder="Enter introduction subtitle"
              value={formData.intro_subtitle}
              onChange={(e) => updateField('intro_subtitle', e.target.value)}
              className="mt-1"
            />
          </div>
        </CardContent>
      </Card>

      {/* Amenities Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg ">Amenities</CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label>Amenities List</Label>
            {formData.amenities.map((amenity, index) => (
              <div key={amenity.id} className="border p-4 rounded-lg mt-2">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium">Amenity {index + 1}</h4>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeListItem('amenities', amenity.id!)}
                    className="text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <div className="space-y-2">
                  <Textarea
                    placeholder="Amenity short mention"
                    value={amenity.title}
                    onChange={(e) => updateListItem('amenities', amenity.id!, 'title', e.target.value)}
                  />
                  <Textarea
                    placeholder="lucide-react related icon"
                    value={amenity.icon}
                    onChange={(e) => updateListItem('amenities', amenity.id!, 'icon', e.target.value)}
                  />
                </div>
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => addListItem('amenities', { title: '', icon: '' })}
              className="mt-2"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Amenity
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Accommodations Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg ">Accommodations</CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label>Accommodations List</Label>
            {formData.accommodations.map((accommodation, index) => (
              <div key={accommodation.id} className="border p-4 rounded-lg mt-2">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium">Accommodation {index + 1}</h4>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeListItem('accommodations', accommodation.id!)}
                    className="text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <div className="space-y-2">
                  <div>
                    <Label>Accommodation Picture</Label>
                    <div className="mt-1 flex items-center space-x-2">
                      <input
                        id={`acc_image_${accommodation.id}`}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            updateListItem('accommodations', accommodation.id!, 'image_url', file.name);
                          }
                        }}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => document.getElementById(`acc_image_${accommodation.id}`)?.click()}
                        className="flex items-center"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Image
                      </Button>
                      {accommodation.image_url && (
                        <span className="text-sm text-gray-600">{accommodation.image_url}</span>
                      )}
                    </div>
                  </div>
                  <Textarea
                    placeholder="Accommodation type short title."
                    value={accommodation.title}
                    onChange={(e) => updateListItem('accommodations', accommodation.id!, 'title', e.target.value)}
                  />
                  <Textarea
                    placeholder="One sentence describing the accommodation in an inspiring way."
                    value={accommodation.subtitle}
                    onChange={(e) => updateListItem('accommodations', accommodation.id!, 'subtitle', e.target.value)}
                  />
                </div>
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => addListItem('accommodations', { title: '', subtitle: '', image_url: '' })}
              className="mt-2"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Accommodation
            </Button>
          </div>
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

export default AboutTab;