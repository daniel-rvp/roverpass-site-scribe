
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Save, Plus, Trash2 } from 'lucide-react';

interface ReservationsTabProps {
  onSave: (data: any) => void;
}

const ReservationsTab: React.FC<ReservationsTabProps> = ({ onSave }) => {
  const [formData, setFormData] = useState({
    reservations_description: '',
    cta_description: '',
    accommodations: [{
      title: '',
      subtitle: '',
      fares: [{
        fare: '',
        title: '',
        description: ''
      }]
    }]
  });

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateAccommodation = (accIndex: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      accommodations: prev.accommodations.map((item, i) => 
        i === accIndex ? { ...item, [field]: value } : item
      )
    }));
  };

  const updateFare = (accIndex: number, fareIndex: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      accommodations: prev.accommodations.map((acc, i) => 
        i === accIndex ? {
          ...acc,
          fares: acc.fares.map((fare, j) => 
            j === fareIndex ? { ...fare, [field]: value } : fare
          )
        } : acc
      )
    }));
  };

  const addAccommodation = () => {
    setFormData(prev => ({
      ...prev,
      accommodations: [...prev.accommodations, {
        title: '',
        subtitle: '',
        fares: [{ fare: '', title: '', description: '' }]
      }]
    }));
  };

  const removeAccommodation = (index: number) => {
    setFormData(prev => ({
      ...prev,
      accommodations: prev.accommodations.filter((_, i) => i !== index)
    }));
  };

  const addFare = (accIndex: number) => {
    setFormData(prev => ({
      ...prev,
      accommodations: prev.accommodations.map((acc, i) => 
        i === accIndex ? {
          ...acc,
          fares: [...acc.fares, { fare: '', title: '', description: '' }]
        } : acc
      )
    }));
  };

  const removeFare = (accIndex: number, fareIndex: number) => {
    setFormData(prev => ({
      ...prev,
      accommodations: prev.accommodations.map((acc, i) => 
        i === accIndex ? {
          ...acc,
          fares: acc.fares.filter((_, j) => j !== fareIndex)
        } : acc
      )
    }));
  };

  const handleSave = () => {
    onSave(formData);
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
          <CardTitle className="text-lg text-blue-700">Page Header</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="reservations_description">Reservations Description</Label>
            <Textarea
              id="reservations_description"
              placeholder="short intro that sets guest expectations. Mention that multiple stay lengths are available and clarify what's included (Wi-Fi, utilities, etc.)."
              value={formData.reservations_description}
              onChange={(e) => updateField('reservations_description', e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="cta_description">CTA Description</Label>
            <Textarea
              id="cta_description"
              placeholder="One-line call to action encouraging bookings or relaxing at the park"
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
          <CardTitle className="text-lg text-blue-700">Accommodations & Pricing</CardTitle>
        </CardHeader>
        <CardContent>
          {formData.accommodations.map((accommodation, accIndex) => (
            <div key={accIndex} className="border-2 border-blue-200 p-6 rounded-lg mt-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-blue-800">Accommodation {accIndex + 1}</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeAccommodation(accIndex)}
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
                    onChange={(e) => updateAccommodation(accIndex, 'title', e.target.value)}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label>Subtitle</Label>
                  <Textarea
                    placeholder="Accommodation subtitle"
                    value={accommodation.subtitle}
                    onChange={(e) => updateAccommodation(accIndex, 'subtitle', e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label>Pricing Tiers</Label>
                  {accommodation.fares.map((fare, fareIndex) => (
                    <div key={fareIndex} className="border p-3 rounded mt-2">
                      <div className="flex justify-between items-center mb-2">
                        <h5 className="font-medium">Pricing Tier {fareIndex + 1}</h5>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeFare(accIndex, fareIndex)}
                          className="text-red-600"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                      <div className="space-y-2">
                        <Textarea
                          placeholder="$X / NIGHT or $X / WEEK"
                          value={fare.fare}
                          onChange={(e) => updateFare(accIndex, fareIndex, 'fare', e.target.value)}
                        />
                        <Textarea
                          placeholder="Rate type (e.g., Daily Rate, Weekly Rate)"
                          value={fare.title}
                          onChange={(e) => updateFare(accIndex, fareIndex, 'title', e.target.value)}
                        />
                        <Textarea
                          placeholder="Brief description of what is included"
                          value={fare.description}
                          onChange={(e) => updateFare(accIndex, fareIndex, 'description', e.target.value)}
                        />
                      </div>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addFare(accIndex)}
                    className="mt-2"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Pricing Tier
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
    </div>
  );
};

export default ReservationsTab;
