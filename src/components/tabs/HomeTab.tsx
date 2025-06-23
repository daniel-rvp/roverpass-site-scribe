
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Save, Plus, Trash2, Upload } from 'lucide-react';

interface HomeTabProps {
  onSave: (data: any) => void;
  clientId: number
}

const HomeTab: React.FC<HomeTabProps> = ({ onSave, clientId }) => {
  const [formData, setFormData] = useState({
    hero_image: '',
    intro_image: '',
    activities_image: '',
    hero_title: '',
    hero_subtitle: '',
    hero_amenity_list: [{ title: '' }],
    intro_title: '',
    intro_subtitle: '',
    amenities_gallery_subtitle: '',
    activities_subtitle: '',
    activities: [{ title: '', icon: '' }],
    amenities_subtitle: '',
    amenities: [{ title: '', description: '', image_url: '' }],
    rule_check_in_out_time: '',
    rule_quiet_time: '',
    rule_campfire: '',
    rule_pets: '',
    rule_wifi: '',
    cta_title: '',
    cta_subtitle: '',
    attractions_subtitle: '',
    attractions: [{ title: '', distance: '', description: '', image_url: '' }]
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

  const [data, setData] = React.useState({
    id: 0,
    hero_title: '',
    hero_subtitle: '',
    hero_image: '',
    activities_image: '',
    activities_subtitle: '',
    amenities_gallery_subtitle: '',
    amenities_gallery_title: '',
    amenities_subtitle: '',
    attractions_subtitle: '',
    created_at: '',
    cta_subtitle: '',
    cta_title: '',
    hero_subtitutle: '',
    intro_image: '',
    intro_subtitle: '',
    intro_title:'',
    rule_campfire: '',
    rule_check_in_out_time: '',
    rule_pets: '',
    rule_quiet_time: '',
    rule_wifi: '',
    rules_image: '',
    rules_subtitle: ''})
  const [heroAmenities, setHeroAmenities] = React.useState([]);
  const [galleryAmenities, setGalleryAmenities] = React.useState([]);
  const [activities, setActivities] = React.useState([]);
  const [amenities, setAmenities] = React.useState([]);
  const [attractions, setAttractions] = React.useState([]);

  useEffect(() => {
    const gatherHomeData = async () => {
      await fetch(`https://bmlrxdnnxhawrhncbvoz.supabase.co/rest/v1/home?client_id=eq.${clientId}`, {
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
      
    gatherHomeData();
  }, [clientId])

  useEffect(() => {
    if (data && data.id != 0) {
      const gatherHomeAmenitiesData = async () => {
        await fetch(`https://bmlrxdnnxhawrhncbvoz.supabase.co//rest/v1/home_hero_amenity?home_id=eq.${data.id}`, {
        method: 'GET',
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJtbHJ4ZG5ueGhhd3JobmNidm96Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTU1Mjc4NSwiZXhwIjoyMDY1MTI4Nzg1fQ.nxB9n8R4OjPaAdCYc8CooJYfx5OVLxcs_Xs3ZKW295I',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJtbHJ4ZG5ueGhhd3JobmNidm96Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTU1Mjc4NSwiZXhwIjoyMDY1MTI4Nzg1fQ.nxB9n8R4OjPaAdCYc8CooJYfx5OVLxcs_Xs3ZKW295I',
        }
      })
      .then(res => res.json())
      .then(res => {
        setHeroAmenities(res);
      })
      }

      gatherHomeAmenitiesData();
    }
  }, [data])

  useEffect(() => {
    if (data && data.id != 0) {
      const gatherGalleryAmenitiesData = async () => {
        await fetch(`https://bmlrxdnnxhawrhncbvoz.supabase.co//rest/v1/home_gallery_amenity?home_id=eq.${data.id}`, {
        method: 'GET',
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJtbHJ4ZG5ueGhhd3JobmNidm96Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTU1Mjc4NSwiZXhwIjoyMDY1MTI4Nzg1fQ.nxB9n8R4OjPaAdCYc8CooJYfx5OVLxcs_Xs3ZKW295I',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJtbHJ4ZG5ueGhhd3JobmNidm96Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTU1Mjc4NSwiZXhwIjoyMDY1MTI4Nzg1fQ.nxB9n8R4OjPaAdCYc8CooJYfx5OVLxcs_Xs3ZKW295I',
        }
      })
      .then(res => res.json())
      .then(res => {
        setGalleryAmenities(res);
      })
      }

      gatherGalleryAmenitiesData();
    }
  }, [data])

  useEffect(() => {
    if (data && data.id != 0) {
      const gatherActivitiesData = async () => {
        await fetch(`https://bmlrxdnnxhawrhncbvoz.supabase.co//rest/v1/home_activity?home_id=eq.${data.id}`, {
        method: 'GET',
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJtbHJ4ZG5ueGhhd3JobmNidm96Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTU1Mjc4NSwiZXhwIjoyMDY1MTI4Nzg1fQ.nxB9n8R4OjPaAdCYc8CooJYfx5OVLxcs_Xs3ZKW295I',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJtbHJ4ZG5ueGhhd3JobmNidm96Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTU1Mjc4NSwiZXhwIjoyMDY1MTI4Nzg1fQ.nxB9n8R4OjPaAdCYc8CooJYfx5OVLxcs_Xs3ZKW295I',
        }
      })
      .then(res => res.json())
      .then(res => {
        setActivities(res);
      })
      }
      gatherActivitiesData();
    }
  }, [data])

  useEffect(() => {
    if (data && data.id != 0) {
      const gatherAmenitiesData = async () => {
        await fetch(`https://bmlrxdnnxhawrhncbvoz.supabase.co//rest/v1/home_amenity?home_id=eq.${data.id}`, {
        method: 'GET',
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJtbHJ4ZG5ueGhhd3JobmNidm96Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTU1Mjc4NSwiZXhwIjoyMDY1MTI4Nzg1fQ.nxB9n8R4OjPaAdCYc8CooJYfx5OVLxcs_Xs3ZKW295I',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJtbHJ4ZG5ueGhhd3JobmNidm96Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTU1Mjc4NSwiZXhwIjoyMDY1MTI4Nzg1fQ.nxB9n8R4OjPaAdCYc8CooJYfx5OVLxcs_Xs3ZKW295I',
        }
      })
      .then(res => res.json())
      .then(res => {
        setAmenities(res);
      })
      }
      gatherAmenitiesData();
    }
  }, [data])

  useEffect(() => {
    if (data && data.id != 0) {
      const gatherAttractionssData = async () => {
        await fetch(`https://bmlrxdnnxhawrhncbvoz.supabase.co//rest/v1/home_attraction?home_id=eq.${data.id}`, {
        method: 'GET',
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJtbHJ4ZG5ueGhhd3JobmNidm96Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTU1Mjc4NSwiZXhwIjoyMDY1MTI4Nzg1fQ.nxB9n8R4OjPaAdCYc8CooJYfx5OVLxcs_Xs3ZKW295I',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJtbHJ4ZG5ueGhhd3JobmNidm96Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTU1Mjc4NSwiZXhwIjoyMDY1MTI4Nzg1fQ.nxB9n8R4OjPaAdCYc8CooJYfx5OVLxcs_Xs3ZKW295I',
        }
      })
      .then(res => res.json())
      .then(res => {
        setAttractions(res);
      })
      }
      gatherAttractionssData();
    }
  }, [data])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Home Page Content</h2>
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
              placeholder={data.hero_title}
              value={formData.hero_title}
              onChange={(e) => updateField('hero_title', e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="hero_subtitle">Hero Subtitle</Label>
            <Textarea
              id="hero_subtitle"
              placeholder={data.hero_subtitle}
              value={formData.hero_subtitle}
              onChange={(e) => updateField('hero_subtitle', e.target.value)}
              className="mt-1"
            />
          </div>
          
          <div>
            <Label>Hero Amenity List</Label>
            {heroAmenities.map((amenity, index) => (
              <div key={index} className="flex gap-2 mt-2">
                <Textarea
                  placeholder="Amenity in 2–3 words inspiring description."
                  value={amenity.title}
                  onChange={(e) => updateListItem('hero_amenity_list', index, 'title', e.target.value)}
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeListItem('hero_amenity_list', index)}
                  className="text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => addListItem('hero_amenity_list', { title: '' })}
              className="mt-2"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Amenity
            </Button>
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
            <Label htmlFor="intro_image">Introduction Image</Label>
            <div className="mt-1 flex items-center space-x-2">
              <input
                id="intro_image"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    updateField('intro_image', file.name);
                  }
                }}
              />
              <Button
                variant="outline"
                onClick={() => document.getElementById('intro_image')?.click()}
                className="flex items-center"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Introduction Image
              </Button>
              {formData.intro_image && (
                <span className="text-sm text-gray-600">{formData.intro_image}</span>
              )}
            </div>
          </div>
          <div>
            <Label htmlFor="intro_title">Introduction Title</Label>
            <Textarea
              id="intro_title"
              placeholder={data.intro_title}
              value={formData.intro_title}
              onChange={(e) => updateField('intro_title', e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="intro_subtitle">Introduction Subtitle</Label>
            <Textarea
              id="intro_subtitle"
              placeholder={data.intro_subtitle}
              value={formData.intro_subtitle}
              onChange={(e) => updateField('intro_subtitle', e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="amenities_gallery_subtitle">Amenities Gallery Subtitle</Label>
            <Textarea
              id="amenities_gallery_subtitle"
              placeholder="One sentence with a brief summary of key amenities and features and inviting to experience it."
              value={formData.amenities_gallery_subtitle}
              onChange={(e) => updateField('amenities_gallery_subtitle', e.target.value)}
              className="mt-1"
            />
          </div>
        </CardContent>
      </Card>

      {/* Activities Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-blue-700">Activities Section</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="activities_image">Activities Image</Label>
            <div className="mt-1 flex items-center space-x-2">
              <input
                id="activities_image"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    updateField('activities_image', file.name);
                  }
                }}
              />
              <Button
                variant="outline"
                onClick={() => document.getElementById('activities_image')?.click()}
                className="flex items-center"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Activities Image
              </Button>
              {formData.activities_image && (
                <span className="text-sm text-gray-600">{formData.activities_image}</span>
              )}
            </div>
          </div>
          <div>
            <Label htmlFor="activities_subtitle">Activities Subtitle</Label>
            <Textarea
              id="activities_subtitle"
              placeholder={data.intro_subtitle}
              value={formData.activities_subtitle}
              onChange={(e) => updateField('activities_subtitle', e.target.value)}
              className="mt-1"
            />
          </div>
          
          <div>
            <Label>Activities List</Label>
            {activities.map((activity, index) => (
              <div key={index} className="border p-4 rounded-lg mt-2">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium">Activity {index + 1}</h4>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeListItem('activities', index)}
                    className="text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <div className="space-y-2">
                  <Textarea
                    placeholder="Activity in a sentence that invites to do it."
                    value={activity.title}
                    onChange={(e) => updateListItem('activities', index, 'title', e.target.value)}
                  />
                  <Textarea
                    placeholder="lucide-react related icon"
                    value={activity.icon}
                    onChange={(e) => updateListItem('activities', index, 'icon', e.target.value)}
                  />
                </div>
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => addListItem('activities', { title: '', icon: '' })}
              className="mt-2"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Activity
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Amenities Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-blue-700">Amenities Section</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="amenities_subtitle">Amenities Subtitle</Label>
            <Textarea
              id="amenities_subtitle"
              placeholder={data.amenities_subtitle}
              value={formData.amenities_subtitle}
              onChange={(e) => updateField('amenities_subtitle', e.target.value)}
              className="mt-1"
            />
          </div>
          
          <div>
            <Label>Amenities List</Label>
            {amenities.map((amenity, index) => (
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
                  <div>
                    <Label>Amenity Picture</Label>
                    <div className="mt-1 flex items-center space-x-2">
                      <input
                        id={`amenity_image_${index}`}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            updateListItem('amenities', index, 'image_url', file.name);
                          }
                        }}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => document.getElementById(`amenity_image_${index}`)?.click()}
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
                  <Textarea
                    placeholder="Amenity name."
                    value={amenity.title}
                    onChange={(e) => updateListItem('amenities', index, 'title', e.target.value)}
                  />
                  <Textarea
                    placeholder="One sentence describing the amenity"
                    value={amenity.description}
                    onChange={(e) => updateListItem('amenities', index, 'description', e.target.value)}
                  />
                </div>
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => addListItem('amenities', { title: '', description: '', image_url: '' })}
              className="mt-2"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Amenity
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Rules Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-blue-700">Park Rules</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="rule_check_in_out_time">Check-in/Check-out Time</Label>
            <Textarea
              id="rule_check_in_out_time"
              placeholder={data.rule_check_in_out_time}
              value={formData.rule_check_in_out_time}
              onChange={(e) => updateField('rule_check_in_out_time', e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="rule_quiet_time">Quiet Time</Label>
            <Textarea
              id="rule_quiet_time"
              placeholder={data.rule_quiet_time}
              value={formData.rule_quiet_time}
              onChange={(e) => updateField('rule_quiet_time', e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="rule_campfire">Campfire Rules</Label>
            <Textarea
              id="rule_campfire"
              placeholder={data.rule_campfire}
              value={formData.rule_campfire}
              onChange={(e) => updateField('rule_campfire', e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="rule_pets">Pet Policy</Label>
            <Textarea
              id="rule_pets"
              placeholder={data.rule_pets}
              value={formData.rule_pets}
              onChange={(e) => updateField('rule_pets', e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="rule_wifi">WiFi Policy</Label>
            <Textarea
              id="rule_wifi"
              placeholder={data.rule_wifi}
              value={formData.rule_wifi}
              onChange={(e) => updateField('rule_wifi', e.target.value)}
              className="mt-1"
            />
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
              placeholder={data.cta_title}
              value={formData.cta_title}
              onChange={(e) => updateField('cta_title', e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="cta_subtitle">CTA Subtitle</Label>
            <Textarea
              id={data.cta_subtitle}
              placeholder="One-line call to action encouraging bookings or relaxing at the park"
              value={formData.cta_subtitle}
              onChange={(e) => updateField('cta_subtitle', e.target.value)}
              className="mt-1"
            />
          </div>
        </CardContent>
      </Card>

      {/* Attractions Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-blue-700">Nearby Attractions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="attractions_subtitle">Attractions Subtitle</Label>
            <Textarea
              id="attractions_subtitle"
              placeholder={data.activities_subtitle}
              value={formData.attractions_subtitle}
              onChange={(e) => updateField('attractions_subtitle', e.target.value)}
              className="mt-1"
            />
          </div>
          
          <div>
            <Label>Attractions List</Label>
            {attractions.map((attraction, index) => (
              <div key={index} className="border p-4 rounded-lg mt-2">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium">Attraction {index + 1}</h4>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeListItem('attractions', index)}
                    className="text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <div className="space-y-2">
                  <div>
                    <Label>Attraction Picture</Label>
                    <div className="mt-1 flex items-center space-x-2">
                      <input
                        id={`attraction_image_${index}`}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            updateListItem('attractions', index, 'image_url', file.name);
                          }
                        }}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => document.getElementById(`attraction_image_${index}`)?.click()}
                        className="flex items-center"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Image
                      </Button>
                      {attraction.image_url && (
                        <span className="text-sm text-gray-600">{attraction.image_url}</span>
                      )}
                    </div>
                  </div>
                  <Textarea
                    placeholder="Attraction name."
                    value={attraction.title}
                    onChange={(e) => updateListItem('attractions', index, 'title', e.target.value)}
                  />
                  <Textarea
                    placeholder="Distance in minutes from park"
                    value={attraction.distance}
                    onChange={(e) => updateListItem('attractions', index, 'distance', e.target.value)}
                  />
                  <Textarea
                    placeholder="One sentence describing the amenity"
                    value={attraction.description}
                    onChange={(e) => updateListItem('attractions', index, 'description', e.target.value)}
                  />
                </div>
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => addListItem('attractions', { title: '', distance: '', description: '', image_url: '' })}
              className="mt-2"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Attraction
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HomeTab;
