
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Save, Plus, Trash2, Upload } from 'lucide-react';

interface AccommodationsTabProps {
  onSave: (data: any) => void;
}

const AccommodationsTab: React.FC<AccommodationsTabProps> = ({ onSave }) => {
  const [formData, setFormData] = useState({
    hero_image: '',
    hero_title: '',
    hero_subtitle: '',
    cta_title: '',
    cta_subtitle: '',
    accommodations_list: [{
      title: '',
      description: '',
      image: '',
      features: [{ title: '', icon: '' }]
    }]
  });

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateAccommodation = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      accommodations_list: prev.accommodations_list.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const updateFeature = (accIndex: number, featIndex: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      accommodations_list: prev.accommodations_list.map((acc, i) => 
        i === accIndex ? {
          ...acc,
          features: acc.features.map((feat, j) => 
            j === featIndex ? { ...feat, [field]: value } : feat
          )
        } : acc
      )
    }));
  };

  const addAccommodation = () => {
    setFormData(prev => ({
      ...prev,
      accommodations_list: [...prev.accommodations_list, {
        title: '',
        description: '',
        image: '',
        features: [{ title: '', icon: '' }]
      }]
    }));
  };

  const removeAccommodation = (index: number) => {
    setFormData(prev => ({
      ...prev,
      accommodations_list: prev.accommodations_list.filter((_, i) => i !== index)
    }));
  };

  const addFeature = (accIndex: number) => {
    setFormData(prev => ({
      ...prev,
      accommodations_list: prev.accommodations_list.map((acc, i) => 
        i === accIndex ? {
          ...acc,
          features: [...acc.features, { title: '', icon: '' }]
        } : acc
      )
    }));
  };

  const removeFeature = (accIndex: number, featIndex: number) => {
    setFormData(prev => ({
      ...prev,
      accommodations_list: prev.accommodations_list.map((acc, i) => 
        i === accIndex ? {
          ...acc,
          features: acc.features.filter((_, j) => j !== featIndex)
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
        <h2 className="text-2xl font-bold text-slate-800">Accommodations Page Content</h2>
        <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
      </div>

      {/* Hero Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-blue-700">Hero Section</CardTitle>
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
          <CardTitle className="text-lg text-blue-700">Accommodations List</CardTitle>
        </CardHeader>
        <CardContent>
          {formData.accommodations_list.map((accommodation, accIndex) => (
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
                  <Label>Accommodation Picture</Label>
                  <div className="mt-1 flex items-center space-x-2">
                    <input
                      id={`acc_main_image_${accIndex}`}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          updateAccommodation(accIndex, 'image', file.name);
                        }
                      }}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => document.getElementById(`acc_main_image_${accIndex}`)?.click()}
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
                    onChange={(e) => updateAccommodation(accIndex, 'title', e.target.value)}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label>Description</Label>
                  <Textarea
                    placeholder="Short Description (2 lines max): Highlight the experience or setting."
                    value={accommodation.description}
                    onChange={(e) => updateAccommodation(accIndex, 'description', e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label>Features</Label>
                  {accommodation.features.map((feature, featIndex) => (
                    <div key={featIndex} className="border p-3 rounded mt-2">
                      <div className="flex justify-between items-center mb-2">
                        <h5 className="font-medium">Feature {featIndex + 1}</h5>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeFeature(accIndex, featIndex)}
                          className="text-red-600"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                      <div className="space-y-2">
                        <Textarea
                          placeholder="Feature in 3-5 words"
                          value={feature.title}
                          onChange={(e) => updateFeature(accIndex, featIndex, 'title', e.target.value)}
                        />
                        <Textarea
                          placeholder="lucide-react related icon"
                          value={feature.icon}
                          onChange={(e) => updateFeature(accIndex, featIndex, 'icon', e.target.value)}
                        />
                      </div>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addFeature(accIndex)}
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

export default AccommodationsTab;
