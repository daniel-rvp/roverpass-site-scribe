
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Save, Plus, Trash2, Upload } from 'lucide-react';

interface AboutTabProps {
  onSave: (data: any) => void;
}

const AboutTab: React.FC<AboutTabProps> = ({ onSave }) => {
  const [formData, setFormData] = useState({
    hero_image: '',
    hero_title: '',
    hero_subtitle: '',
    intro_title: '',
    intro_subtitle: '',
    amenities: [{ title: '', icon: '' }],
    accomodations: [{ title: '', subtitle: '', image_url: '' }],
    cta_title: '',
    cta_subtitle: ''
  });

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateListItem = (listName: string, index: number, field: string, value: string) => {
    setFormData(prev => {
      const currentList = prev[listName as keyof typeof prev];
      if (Array.isArray(currentList)) {
        return {
          ...prev,
          [listName]: currentList.map((item: any, i: number) => 
            i === index ? { ...item, [field]: value } : item
          )
        };
      }
      return prev;
    });
  };

  const addListItem = (listName: string, template: any) => {
    setFormData(prev => {
      const currentList = prev[listName as keyof typeof prev];
      if (Array.isArray(currentList)) {
        return {
          ...prev,
          [listName]: [...currentList, template]
        };
      }
      return prev;
    });
  };

  const removeListItem = (listName: string, index: number) => {
    setFormData(prev => {
      const currentList = prev[listName as keyof typeof prev];
      if (Array.isArray(currentList)) {
        return {
          ...prev,
          [listName]: currentList.filter((_: any, i: number) => i !== index)
        };
      }
      return prev;
    });
  };

  const handleSave = () => {
    onSave(formData);
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
              placeholder="Title encouraging to go to the camp, mention the name."
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

      {/* Introduction Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-blue-700">Introduction Section</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="intro_title">Introduction Title</Label>
            <Textarea
              id="intro_title"
              placeholder="One short sentence that gathers all the amenities and vibe."
              value={formData.intro_title}
              onChange={(e) => updateField('intro_title', e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="intro_subtitle">Introduction Subtitle</Label>
            <Textarea
              id="intro_subtitle"
              placeholder="short 3-line paragraph introducing the park's accommodations. Mention variety (cabins, RV sites, tent sites, etc.), comfort, and access to amenities. Keep it general and location-relevant."
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
          <CardTitle className="text-lg text-blue-700">Amenities</CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label>Amenities List</Label>
            {formData.amenities.map((amenity, index) => (
              <div key={index} className="border p-4 rounded-lg mt-2">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium">Amenity {index + 1}</h4>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeListItem('amenities', index)}
                    className="text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <div className="space-y-2">
                  <Textarea
                    placeholder="Amenity short mention"
                    value={amenity.title}
                    onChange={(e) => updateListItem('amenities', index, 'title', e.target.value)}
                  />
                  <Textarea
                    placeholder="lucide-react related icon"
                    value={amenity.icon}
                    onChange={(e) => updateListItem('amenities', index, 'icon', e.target.value)}
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
          <CardTitle className="text-lg text-blue-700">Accommodations</CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label>Accommodations List</Label>
            {formData.accomodations.map((accommodation, index) => (
              <div key={index} className="border p-4 rounded-lg mt-2">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium">Accommodation {index + 1}</h4>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeListItem('accomodations', index)}
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
                        id={`acc_image_${index}`}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            updateListItem('accomodations', index, 'image_url', file.name);
                          }
                        }}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => document.getElementById(`acc_image_${index}`)?.click()}
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
                    onChange={(e) => updateListItem('accomodations', index, 'title', e.target.value)}
                  />
                  <Textarea
                    placeholder="One sentence describing the accommodation in a inspiring way."
                    value={accommodation.subtitle}
                    onChange={(e) => updateListItem('accomodations', index, 'subtitle', e.target.value)}
                  />
                </div>
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => addListItem('accomodations', { title: '', subtitle: '', image_url: '' })}
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

export default AboutTab;
