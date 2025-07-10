import React, { useEffect, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Save, Plus, Trash2, Upload } from 'lucide-react';

// Define interfaces for better type safety and clarity
interface Fare {
  // No 'id' here, as these are nested JSONB objects, not separate records
  fare: string;
  title: string;
  description: string;
}

interface Accommodation {
  id: number | null; // This ID is for the reservations_accommodation table
  title: string;
  subtitle: string;
  fares: Fare[]; // Fares are directly nested here, ensure this is always an array
  reservations_id?: number; // Optional, will be set when linked to main 'reservations' record
}

interface ReservationsFormData {
  id: number | null; // Added to store the main 'reservations' record ID
  reservations_image: string;
  reservations_description: string;
  cta_description: string;
  accommodations: Accommodation[];
}

interface ReservationsTabProps {
  onSave: (data: any) => void;
  clientId: number;
}

const ReservationsTab: React.FC<ReservationsTabProps> = ({ onSave, clientId }) => {
  const [formData, setFormData] = useState<ReservationsFormData>({
    id: null,
    reservations_image: '',
    reservations_description: '',
    cta_description: '',
    accommodations: [], // Initialize as empty array
  });

  // Store original data to compare changes for PATCH/DELETE operations
  const [originalAccommodations, setOriginalAccommodations] = useState<Accommodation[]>([]);

  // Supabase headers
  const supabaseHeaders = {
    'Content-Type': 'application/json',
    'apikey': `${import.meta.env.VITE_KEY}`,
    'Authorization': `Bearer ${import.meta.env.VITE_KEY}`,
    'Prefer': 'return=representation'
  };

  // Helper to generate temporary IDs for new items (for accommodations only)
  const generateTempId = () => Date.now() + Math.random();

  // Unified data gathering function
  const gatherData = useCallback(async () => {
    try {
      // Fetch main 'reservations' data
      const mainReservationsResponse = await fetch(`https://bmlrxdnnxhawrhncbvoz.supabase.co/rest/v1/reservations?client_id=eq.${clientId}`, {
        method: 'GET',
        headers: supabaseHeaders,
      });
      const fetchedMainReservations = await mainReservationsResponse.json();

      const initialMainData = fetchedMainReservations[0] || {
        id: null,
        reservations_image: '',
        reservations_description: '',
        cta_description: '',
      };

      let fetchedAccommodations: Accommodation[] = [];

      // If main 'reservations' data exists, fetch associated accommodations
      // The 'fares' array should be part of the 'reservations_accommodation' record itself
      if (initialMainData.id) {
        const accommodationsResponse = await fetch(`https://bmlrxdnnxhawrhncbvoz.supabase.co/rest/v1/reservations_accommodation?reservations_id=eq.${initialMainData.id}`, {
          method: 'GET',
          headers: supabaseHeaders,
        });
        fetchedAccommodations = await accommodationsResponse.json();

        // **Crucial Fix:** Ensure 'fares' is an array for each accommodation
        fetchedAccommodations = fetchedAccommodations.map(acc => ({
          ...acc,
          fares: Array.isArray(acc.fares) ? acc.fares : [] // Initialize to empty array if not already an array
        }));
      }

      setFormData({
        ...initialMainData,
        accommodations: fetchedAccommodations,
      });

      setOriginalAccommodations(fetchedAccommodations);

    } catch (error) {
      console.error("Error gathering initial data:", error);
    }
  }, [clientId]); // Dependency array for useCallback

  // First useEffect: Triggers data gathering on component mount or clientId change
  useEffect(() => {
    gatherData();
  }, [gatherData]); // Dependency array for useEffect

  // Update main form fields
  const updateField = (field: keyof ReservationsFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Update accommodation fields
  const updateAccommodation = (id: number | null, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      accommodations: prev.accommodations.map((acc) =>
        acc.id === id ? { ...acc, [field]: value } : acc
      )
    }));
  };

  // Update fare fields within an accommodation
  const updateFare = (accId: number | null, fareIndex: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      accommodations: prev.accommodations.map((acc) =>
        acc.id === accId ? {
          ...acc,
          fares: acc.fares.map((fare, idx) =>
            idx === fareIndex ? { ...fare, [field]: value } : fare
          )
        } : acc
      )
    }));
  };

  const addAccommodation = () => {
    setFormData(prev => ({
      ...prev,
      accommodations: [...prev.accommodations, {
        id: generateTempId(), // Assign a temp ID
        title: '',
        subtitle: '',
        fares: [{ fare: '', title: '', description: '' }] // New accommodation starts with one fare
      }]
    }));
  };

  const removeAccommodation = (id: number | null) => {
    setFormData(prev => ({
      ...prev,
      accommodations: prev.accommodations.filter((acc) => acc.id !== id)
    }));
  };

  const addFare = (accId: number | null) => {
    setFormData(prev => ({
      ...prev,
      accommodations: prev.accommodations.map((acc) =>
        acc.id === accId ? {
          ...acc,
          // Ensure fares is an array before spreading
          fares: Array.isArray(acc.fares) ? [...acc.fares, { fare: '', title: '', description: '' }] : [{ fare: '', title: '', description: '' }]
        } : acc
      )
    }));
  };

  const removeFare = (accId: number | null, fareIndex: number) => {
    setFormData(prev => ({
      ...prev,
      accommodations: prev.accommodations.map((acc) =>
        acc.id === accId ? {
          ...acc,
          fares: acc.fares.filter((_, idx) => idx !== fareIndex)
        } : acc
      )
    }));
  };

  const handleSave = async () => {
    try {
      const allPromises: Promise<any>[] = [];

      // --- Handle Main Reservations Data ---
      const mainReservationsToSave = {
        reservations_image: formData.reservations_image,
        reservations_description: formData.reservations_description,
        cta_description: formData.cta_description,
        client_id: clientId
      };

      let currentReservationsId = formData.id;

      if (formData.id) {
        // Update existing main 'reservations' record
        allPromises.push(
          fetch(`https://bmlrxdnnxhawrhncbvoz.supabase.co/rest/v1/reservations?id=eq.${formData.id}`, {
            method: 'PATCH',
            headers: supabaseHeaders,
            body: JSON.stringify(mainReservationsToSave)
          }).then(res => res.json())
        );
      } else {
        // Create new main 'reservations' record
        const response = await fetch(`https://bmlrxdnnxhawrhncbvoz.supabase.co/rest/v1/reservations`, {
          method: 'POST',
          headers: supabaseHeaders,
          body: JSON.stringify(mainReservationsToSave)
        });
        const newMainReservations = await response.json();
        if (newMainReservations && newMainReservations.length > 0) {
          currentReservationsId = newMainReservations[0].id;
          // IMPORTANT: Update formData with the new ID immediately so nested saves can use it
          setFormData(prev => ({ ...prev, id: currentReservationsId }));
        } else {
          throw new Error("Failed to create main reservations record.");
        }
      }

      // Ensure currentReservationsId is available for nested items
      if (!currentReservationsId) {
        console.error("Main Reservations ID not available for saving nested items.");
        return;
      }

      // --- Handle Accommodations (including their nested fares) ---
      const accommodationIdsToRemove = originalAccommodations
        .filter(originalAcc => !formData.accommodations.some(currentAcc => currentAcc.id === originalAcc.id))
        .map(acc => acc.id);

      for (const id of accommodationIdsToRemove) {
        if (id !== null) {
          allPromises.push(
            fetch(`https://bmlrxdnnxhawrhncbvoz.supabase.co/rest/v1/reservations_accommodation?id=eq.${id}`, {
              method: 'DELETE',
              headers: supabaseHeaders,
            }).then(res => res.json())
          );
        }
      }

      for (const accommodation of formData.accommodations) {
        // The 'fares' array is sent directly as part of the accommodation object
        const accommodationToSave = {
          title: accommodation.title,
          subtitle: accommodation.subtitle,
          fares: accommodation.fares, // Include the fares array here
          reservations_id: currentReservationsId // Link to the main reservations table
        };

        if (accommodation.id && originalAccommodations.some(orig => orig.id === accommodation.id)) {
          // Existing accommodation: check for updates
          const originalAccommodation = originalAccommodations.find(orig => orig.id === accommodation.id);
          // Deep comparison for fares array needed here for robust updates
          // Using JSON.stringify for a quick deep comparison, though a more robust
          // deepEquals function might be preferred for complex objects.
          const faresChanged = JSON.stringify(originalAccommodation?.fares) !== JSON.stringify(accommodation.fares);

          if (originalAccommodation && (
            originalAccommodation.title !== accommodation.title ||
            originalAccommodation.subtitle !== accommodation.subtitle ||
            faresChanged // Check if fares array has changed
          )) {
            allPromises.push(
              fetch(`https://bmlrxdnnxhawrhncbvoz.supabase.co/rest/v1/reservations_accommodation?id=eq.${accommodation.id}`, {
                method: 'PATCH',
                headers: supabaseHeaders,
                body: JSON.stringify(accommodationToSave)
              }).then(res => res.json())
            );
          }
        } else {
          // New accommodation
          allPromises.push(
            fetch(`https://bmlrxdnnxhawrhncbvoz.supabase.co/rest/v1/reservations_accommodation`, {
              method: 'POST',
              headers: supabaseHeaders,
              body: JSON.stringify(accommodationToSave)
            }).then(res => res.json())
              .then(newAcc => {
                if (newAcc && newAcc.length > 0) {
                  // Update formData with the real ID for the newly created accommodation
                  setFormData(prev => ({
                    ...prev,
                    accommodations: prev.accommodations.map(acc =>
                      acc.id === accommodation.id ? { ...acc, id: newAcc[0].id } : acc
                    )
                  }));
                }
              })
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
        <h2 className="text-2xl font-bold text-slate-800">Reservations Page Content</h2>
        <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
      </div>

      {/* Header Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg ">Page Header</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="reservations_image">Reservations Image</Label>
            <div className="mt-1 flex items-center space-x-2">
              <input
                id="reservations_image"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    updateField('reservations_image', file.name);
                  }
                }}
              />
              <Button
                variant="outline"
                onClick={() => document.getElementById('reservations_image')?.click()}
                className="flex items-center"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Reservations Image
              </Button>
              {formData.reservations_image && (
                <span className="text-sm text-gray-600">{formData.reservations_image}</span>
              )}
            </div>
          </div>
          <div>
            <Label htmlFor="reservations_description">Reservations Description</Label>
            <Textarea
              id="reservations_description"
              placeholder="Enter reservations description"
              value={formData.reservations_description}
              onChange={(e) => updateField('reservations_description', e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="cta_description">CTA Description</Label>
            <Textarea
              id="cta_description"
              placeholder="Enter CTA description"
              value={formData.cta_description}
              onChange={(e) => updateField('cta_description', e.target.value)}
              className="mt-1"
            />
          </div>
        </CardContent>
      </Card>

      {/* Accommodations and Pricing */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg ">Accommodations & Pricing</CardTitle>
        </CardHeader>
        <CardContent>
          {
            formData.accommodations.map((accommodation, accIndex) => (
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
                    <Label>Accommodation Title</Label>
                    <Textarea
                      placeholder="Accommodation title"
                      value={accommodation.title}
                      onChange={(e) => updateAccommodation(accommodation.id!, 'title', e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label>Subtitle</Label>
                    <Textarea
                      placeholder="Accommodation subtitle"
                      value={accommodation.subtitle}
                      onChange={(e) => updateAccommodation(accommodation.id!, 'subtitle', e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label>Pricing Tiers</Label>
                    {
                      // Direct iteration over accommodation.fares without an extra .fares
                      accommodation.fares.map((fare, fareIndex) => (
                        <div key={fareIndex} className="border p-3 rounded mt-2">
                          <div className="flex justify-between items-center mb-2">
                            <h5 className="font-medium">Pricing Tier {fareIndex + 1}</h5>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => removeFare(accommodation.id!, fareIndex)}
                              className="text-red-600"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                          <div className="space-y-2">
                            <Textarea
                              placeholder="$X / NIGHT or $X / WEEK"
                              value={fare.fare}
                              onChange={(e) => updateFare(accommodation.id!, fareIndex, 'fare', e.target.value)}
                            />
                            <Textarea
                              placeholder="Rate type (e.g., Daily Rate, Weekly Rate)"
                              value={fare.title}
                              onChange={(e) => updateFare(accommodation.id!, fareIndex, 'title', e.target.value)}
                            />
                            <Textarea
                              placeholder="Brief description of what is included"
                              value={fare.description}
                              onChange={(e) => updateFare(accommodation.id!, fareIndex, 'description', e.target.value)}
                            />
                          </div>
                        </div>
                      ))
                    }
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => addFare(accommodation.id!)}
                      className="mt-2"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Pricing Tier
                    </Button>
                  </div>
                </div>
              </div>
            ))
          }

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
    </div>
  );
};

export default ReservationsTab;