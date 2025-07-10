import React, { useEffect, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Save, Plus, Trash2, Upload } from 'lucide-react';

interface Feature {
  id: number | null; // Null for new items
  title: string;
  icon: string;
  accommodation_site_id?: number; // Link to the parent accommodation_site
}

interface Accommodation {
  id: number | null; // Null for new items
  title: string;
  description: string;
  image: string;
  features: Feature[]; // Ensuring this is always an array
  client_id?: number; // Added client_id for consistency
  accommodation_id?: number; // Link to the main accommodations table
}

interface AccommodationsTabProps {
  onSave: (data: any) => void;
  clientId: number
}

const AccommodationsTab: React.FC<AccommodationsTabProps> = ({ onSave, clientId }) => {
  const [formData, setFormData] = useState({
    id: null as number | null, // ID for the main accommodations record
    hero_image: '',
    hero_title: '',
    hero_subtitle: '',
    cta_title: '',
    cta_subtitle: '',
    accommodations_list: [] as Accommodation[], // Initialize as empty array
  });

  const [originalAccommodations, setOriginalAccommodations] = useState<Accommodation[]>([]);

  const generateTempId = () => Date.now() + Math.random();

  const supabaseHeaders = {
    'Content-Type': 'application/json',
    'apikey': `${import.meta.env.VITE_KEY}`,
    'Authorization': `Bearer ${import.meta.env.VITE_KEY}`,
    'Prefer': 'return=representation'
  };

  const gatherData = useCallback(async () => {
    try {
      // Fetch main accommodations data
      const mainAccommodationsResponse = await fetch(`https://bmlrxdnnxhawrhncbvoz.supabase.co/rest/v1/accommodations?client_id=eq.${clientId}`, {
        method: 'GET',
        headers: supabaseHeaders,
      });
      const fetchedMainAccommodations = await mainAccommodationsResponse.json();

      const initialMainData = fetchedMainAccommodations[0] || {
        id: null,
        hero_image: '',
        hero_title: '',
        hero_subtitle: '',
        cta_title: '',
        cta_subtitle: '',
      };

      setFormData(prev => ({
        ...prev,
        ...initialMainData,
      }));

      // If main accommodations data exists, fetch individual accommodation sites
      if (initialMainData.id) {
        const accommodationsSitesResponse = await fetch(`https://bmlrxdnnxhawrhncbvoz.supabase.co/rest/v1/accommodations_site?accommodation_id=eq.${initialMainData.id}`, {
          method: 'GET',
          headers: supabaseHeaders,
        });
        let fetchedAccommodationSites: Accommodation[] = await accommodationsSitesResponse.json();

        // **CRITICAL FIX:** Ensure 'features' property exists and is an array for each accommodation
        fetchedAccommodationSites = fetchedAccommodationSites.map(acc => ({
          ...acc,
          features: Array.isArray(acc.features) ? acc.features : [] // Ensure features is always an array
        }));

        setFormData(prev => ({
          ...prev,
          accommodations_list: fetchedAccommodationSites,
        }));
        setOriginalAccommodations(fetchedAccommodationSites); // Store for change tracking

      } else {
        // If no main record, ensure lists are empty
        setFormData(prev => ({
          ...prev,
          accommodations_list: [],
        }));
        setOriginalAccommodations([]);
      }

    } catch (error) {
      console.error("Error gathering initial data:", error);
    }
  }, [clientId]);

  useEffect(() => {
    gatherData();
  }, [gatherData]);

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateAccommodation = (id: number | null, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      accommodations_list: prev.accommodations_list.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    }));
  };

  const updateFeature = (accId: number | null, featId: number | null, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      accommodations_list: prev.accommodations_list.map((acc) =>
        acc.id === accId ? {
          ...acc,
          features: acc.features.map((feat) =>
            feat.id === featId ? { ...feat, [field]: value } : feat
          )
        } : acc
      )
    }));
  };

  const addAccommodation = () => {
    setFormData(prev => ({
      ...prev,
      accommodations_list: [...prev.accommodations_list, {
        id: generateTempId(),
        title: '',
        description: '',
        image: '',
        features: [],
      }]
    }));
  };

  const removeAccommodation = (id: number | null) => {
    setFormData(prev => ({
      ...prev,
      accommodations_list: prev.accommodations_list.filter((item) => item.id !== id)
    }));
  };

  const addFeature = (accId: number | null) => {
    setFormData(prev => ({
      ...prev,
      accommodations_list: prev.accommodations_list.map((acc) =>
        acc.id === accId ? {
          ...acc,
          features: [...acc.features, { id: generateTempId(), title: '', icon: '' }]
        } : acc
      )
    }));
  };

  const removeFeature = (accId: number | null, featId: number | null) => {
    setFormData(prev => ({
      ...prev,
      accommodations_list: prev.accommodations_list.map((acc) =>
        acc.id === accId ? {
          ...acc,
          features: acc.features.filter((feat) => feat.id !== featId)
        } : acc
      )
    }));
  };

  const handleSave = async () => {
    try {
      const allPromises: Promise<any>[] = [];

      // --- Handle Main Accommodations Data ---
      const mainAccommodationsToSave = {
        hero_image: formData.hero_image,
        hero_title: formData.hero_title,
        hero_subtitle: formData.hero_subtitle,
        cta_title: formData.cta_title,
        cta_subtitle: formData.cta_subtitle,
        client_id: clientId
      };

      const existingMainAccommodations = (await (await fetch(`https://bmlrxdnnxhawrhncbvoz.supabase.co/rest/v1/accommodations?client_id=eq.${clientId}`, {
        method: 'GET',
        headers: supabaseHeaders,
      })).json())[0];

      let currentMainAccommodationsId = formData.id;

      if (existingMainAccommodations) {
        allPromises.push(
          fetch(`https://bmlrxdnnxhawrhncbvoz.supabase.co/rest/v1/accommodations?id=eq.${existingMainAccommodations.id}`, {
            method: 'PATCH',
            headers: supabaseHeaders,
            body: JSON.stringify(mainAccommodationsToSave)
          }).then(res => res.json())
        );
        currentMainAccommodationsId = existingMainAccommodations.id;
      } else {
        const response = await fetch(`https://bmlrxdnnxhawrhncbvoz.supabase.co/rest/v1/accommodations`, {
          method: 'POST',
          headers: supabaseHeaders,
          body: JSON.stringify(mainAccommodationsToSave)
        });
        const newMainAccommodations = await response.json();
        if (newMainAccommodations && newMainAccommodations.length > 0) {
          currentMainAccommodationsId = newMainAccommodations[0].id;
          setFormData(prev => ({ ...prev, id: currentMainAccommodationsId }));
        } else {
          throw new Error("Failed to create main accommodations record.");
        }
      }

      if (!currentMainAccommodationsId) {
        console.error("Main accommodations ID not available for saving accommodation sites.");
        return;
      }

      // --- Handle Accommodation Sites (accommodations_site) ---
      const accommodationSiteIdsToRemove = originalAccommodations
        .filter(originalAcc => !formData.accommodations_list.some(currentAcc => currentAcc.id === originalAcc.id))
        .map(acc => acc.id);

      for (const id of accommodationSiteIdsToRemove) {
        if (id !== null) {
          allPromises.push(
            fetch(`https://bmlrxdnnxhawrhncbvoz.supabase.co/rest/v1/accommodations_site?id=eq.${id}`, {
              method: 'DELETE',
              headers: supabaseHeaders,
            }).then(res => res.json())
          );
        }
      }

      for (const accommodation of formData.accommodations_list) {
        const accommodationSiteToSave = {
          title: accommodation.title,
          description: accommodation.description,
          image: accommodation.image,
          accommodation_id: currentMainAccommodationsId,
          features: accommodation.features
        };

        let currentAccommodationSiteId = accommodation.id;

        if (accommodation.id && originalAccommodations.some(orig => orig.id === accommodation.id)) {
          const originalAcc = originalAccommodations.find(orig => orig.id === accommodation.id);
          const hasChanges = originalAcc && (
            originalAcc.title !== accommodation.title ||
            originalAcc.description !== accommodation.description ||
            originalAcc.image !== accommodation.image ||
            JSON.stringify(originalAcc.features) !== JSON.stringify(accommodation.features)
          );

          if (hasChanges) {
            allPromises.push(
              fetch(`https://bmlrxdnnxhawrhncbvoz.supabase.co/rest/v1/accommodations_site?id=eq.${accommodation.id}`, {
                method: 'PATCH',
                headers: supabaseHeaders,
                body: JSON.stringify(accommodationSiteToSave)
              }).then(res => res.json())
            );
          }
        } else {
          const response = await fetch(`https://bmlrxdnnxhawrhncbvoz.supabase.co/rest/v1/accommodations_site`, {
            method: 'POST',
            headers: supabaseHeaders,
            body: JSON.stringify(accommodationSiteToSave)
          });
          const newAccommodationSite = await response.json();
          if (newAccommodationSite && newAccommodationSite.length > 0) {
            currentAccommodationSiteId = newAccommodationSite[0].id;
            setFormData(prev => ({
              ...prev,
              accommodations_list: prev.accommodations_list.map(acc =>
                acc.id === accommodation.id ? { ...acc, id: currentAccommodationSiteId } : acc
              )
            }));
          } else {
            throw new Error("Failed to create accommodation site record.");
          }
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
        <h2 className="text-2xl font-bold text-slate-800">Accommodations Page Content</h2>
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
              placeholder="Inspiration encouraging title."
              value={formData.hero_title}
              onChange={(e) => updateField('hero_title', e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="hero_subtitle">Hero Subtitle</Label>
            <Textarea
              id="hero_subtitle"
              placeholder="One clear, benefit-driven phrase that introduces the page and encourages guests to explore the accommodation options."
              value={formData.hero_subtitle}
              onChange={(e) => updateField('hero_subtitle', e.target.value)}
              className="mt-1"
            />
          </div>
        </CardContent>
      </Card>

      {/* Accommodations List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg ">Accommodations List</CardTitle>
        </CardHeader>
        <CardContent>
          {formData.accommodations_list.map((accommodation, accIndex) => (
            <div key={accommodation.id} className="border-2  p-6 rounded-lg mt-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold ">Accommodation {accIndex + 1}</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeAccommodation(accommodation.id!)}
                  className="text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <Label>Accommodation Picture</Label>
                  <div className="mt-1 flex items-center space-x-2">
                    <input
                      id={`acc_main_image_${accommodation.id}`}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          updateAccommodation(accommodation.id!, 'image', file.name);
                        }
                      }}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => document.getElementById(`acc_main_image_${accommodation.id}`)?.click()}
                      className="flex items-center"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Image
                    </Button>
                    {accommodation.image && (
                      <span className="text-sm text-gray-600">{accommodation.image}</span>
                    )}
                  </div>
                </div>

                <div>
                  <Label>Accommodation Title</Label>
                  <Textarea
                    placeholder="Name of the accommodation"
                    value={accommodation.title}
                    onChange={(e) => updateAccommodation(accommodation.id!, 'title', e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label>Description</Label>
                  <Textarea
                    placeholder="Short Description (2 lines max): Highlight the experience or setting."
                    value={accommodation.description}
                    onChange={(e) => updateAccommodation(accommodation.id!, 'description', e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label>Features</Label>
                  {/* Now that we ensure accommodation.features is an array, .map() will work */}
                  {accommodation.features && accommodation.features.length > 0 ?
                    accommodation.features.map((feature, featIndex) => (
                      <div key={feature.id} className="border p-3 rounded mt-2">
                        <div className="flex justify-between items-center mb-2">
                          <h5 className="font-medium">Feature {featIndex + 1}</h5>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeFeature(accommodation.id!, feature.id!)}
                            className="text-red-600"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                        <div className="space-y-2">
                          <Textarea
                            placeholder="Feature in 3-5 words"
                            value={feature.title}
                            onChange={(e) => updateFeature(accommodation.id!, feature.id!, 'title', e.target.value)}
                          />
                          <Textarea
                            placeholder="lucide-react related icon"
                            value={feature.icon}
                            onChange={(e) => updateFeature(accommodation.id!, feature.id!, 'icon', e.target.value)}
                          />
                        </div>
                      </div>
                    ))
                    : null
                  }
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addFeature(accommodation.id!)}
                    className="mt-2"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Feature
                  </Button>
                </div>
              </div>
            </div>
          ))}

          <Button
            variant="outline"
            onClick={addAccommodation}
            className="mt-4"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Accommodation
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

export default AccommodationsTab;