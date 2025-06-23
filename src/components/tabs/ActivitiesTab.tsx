
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Save, Plus, Trash2, Upload } from 'lucide-react';

interface ActivitiesTabProps {
  onSave: (data: any) => void;
  clientId: number
}

const ActivitiesTab: React.FC<ActivitiesTabProps> = ({ onSave, clientId }) => {
  const [formData, setFormData] = useState({
    hero_description: '',
    hero_image: '',
    activities: [{
      title: '',
      description: '',
      icon: '',
      category: '0',
      image_url: ''
    }]
  });

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateActivity = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      activities: prev.activities.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const addActivity = () => {
    setFormData(prev => ({
      ...prev,
      activities: [...prev.activities, { title: '', description: '', icon: '', category: '0', image_url: '' }]
    }));
  };

  const removeActivity = (index: number) => {
    setFormData(prev => ({
      ...prev,
      activities: prev.activities.filter((_, i) => i !== index)
    }));
  };

  const categoryOptions = [
    { value: '0', label: 'Outdoor' },
    { value: '1', label: 'Family' },
    { value: '2', label: 'Cultural' },
    { value: '3', label: 'Recommendation' }
  ];

  const handleSave = () => {
    onSave(formData);
  };

  const [data, setData] = useState({
    id: 0,
    created_at: "",
    client_id: 0,
    hero_description: "",
    hero_image: "",
  })
  const [outdoorActivities, setOutdoorActivities] = useState<Array<string>>([]);
  const [familyFun, setFamilyFun] = useState<Array<string>>([]);
  const [artsCulture, setArtsCulture] = useState<Array<string>>([]);
  const [recommendations, setRecommendations] = useState<Array<string>>([]);

  useEffect(() => {
    const gatherActivitiesData = async () => {
      await fetch(`https://bmlrxdnnxhawrhncbvoz.supabase.co//rest/v1/activities?client_id=eq.${clientId}`, {
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
      
    gatherActivitiesData();
  }, [clientId])

  useEffect(() => {
    if (data && data.id != 0) {
      const gatheActivitiesActivityData = async () => {
        await fetch(`https://bmlrxdnnxhawrhncbvoz.supabase.co//rest/v1/activities_activity?activities_id=eq.${data.id}`, {
        method: 'GET',
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJtbHJ4ZG5ueGhhd3JobmNidm96Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTU1Mjc4NSwiZXhwIjoyMDY1MTI4Nzg1fQ.nxB9n8R4OjPaAdCYc8CooJYfx5OVLxcs_Xs3ZKW295I',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJtbHJ4ZG5ueGhhd3JobmNidm96Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTU1Mjc4NSwiZXhwIjoyMDY1MTI4Nzg1fQ.nxB9n8R4OjPaAdCYc8CooJYfx5OVLxcs_Xs3ZKW295I',
        }
      })
      .then(res => res.json())
      .then(res => {
        const activities = res;
        setOutdoorActivities(activities.filter(a => a.category === 0));
        setFamilyFun(activities.filter(a => a.category === 1));
        setArtsCulture(activities.filter(a => a.category === 2));
        setRecommendations(activities.filter(a => a.category === 3));
      })
      }

      gatheActivitiesActivityData();
    }
  }, [data])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Activities Page Content</h2>
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
              {data.hero_image && (
                <span className="text-sm text-gray-600">{data.hero_image}</span>
              )}
            </div>
          </div>
          <div>
            <Label htmlFor="hero_description">Hero Description</Label>
            <Textarea
              id="hero_description"
              placeholder={data.hero_description}
              value={formData.hero_description}
              onChange={(e) => updateField('hero_description', e.target.value)}
              className="mt-1"
            />
          </div>
        </CardContent>
      </Card>

      {/* Activities List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-blue-700">Outdoor Activities</CardTitle>
        </CardHeader>
        <CardContent>
          {outdoorActivities.map((activity, index) => (
            <div key={index} className="border-2 border-blue-200 p-4 rounded-lg mt-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-blue-800">Activity {index + 1}</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeActivity(index)}
                  className="text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label>Activity Picture</Label>
                  <div className="mt-1 flex items-center space-x-2">
                    <input
                      id={`activity_image_${index}`}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          updateActivity(index, 'image_url', file.name);
                        }
                      }}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => document.getElementById(`activity_image_${index}`)?.click()}
                      className="flex items-center"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Image
                    </Button>
                    {activity.image_url && (
                      <span className="text-sm text-gray-600">{activity.image_url}</span>
                    )}
                  </div>
                </div>
                
                <div>
                  <Label>Activity Title</Label>
                  <Textarea
                    placeholder="Activity name"
                    value={activity.title}
                    onChange={(e) => updateActivity(index, 'title', e.target.value)}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label>Description</Label>
                  <Textarea
                    placeholder="Inspiring one short sentence description"
                    value={activity.description}
                    onChange={(e) => updateActivity(index, 'description', e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label>Icon</Label>
                  <Textarea
                    placeholder="lucide-react related icon"
                    value={activity.icon}
                    onChange={(e) => updateActivity(index, 'icon', e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label>Category</Label>
                  <Select value={activity.category} onValueChange={(value) => updateActivity(index, 'category', value)}>
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
            onClick={addActivity}
            className="mt-4"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Activity
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-blue-700">Familiy Activities</CardTitle>
        </CardHeader>
        <CardContent>
          {outdoorActivities.map((activity, index) => (
            <div key={index} className="border-2 border-blue-200 p-4 rounded-lg mt-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-blue-800">Activity {index + 1}</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeActivity(index)}
                  className="text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label>Activity Picture</Label>
                  <div className="mt-1 flex items-center space-x-2">
                    <input
                      id={`activity_image_${index}`}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          updateActivity(index, 'image_url', file.name);
                        }
                      }}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => document.getElementById(`activity_image_${index}`)?.click()}
                      className="flex items-center"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Image
                    </Button>
                    {activity.image_url && (
                      <span className="text-sm text-gray-600">{activity.image_url}</span>
                    )}
                  </div>
                </div>
                
                <div>
                  <Label>Activity Title</Label>
                  <Textarea
                    placeholder="Activity name"
                    value={activity.title}
                    onChange={(e) => updateActivity(index, 'title', e.target.value)}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label>Description</Label>
                  <Textarea
                    placeholder="Inspiring one short sentence description"
                    value={activity.description}
                    onChange={(e) => updateActivity(index, 'description', e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label>Icon</Label>
                  <Textarea
                    placeholder="lucide-react related icon"
                    value={activity.icon}
                    onChange={(e) => updateActivity(index, 'icon', e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label>Category</Label>
                  <Select value={activity.category} onValueChange={(value) => updateActivity(index, 'category', value)}>
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
            onClick={addActivity}
            className="mt-4"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Activity
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-blue-700">Arts & Culture</CardTitle>
        </CardHeader>
        <CardContent>
          {artsCulture.map((activity, index) => (
            <div key={index} className="border-2 border-blue-200 p-4 rounded-lg mt-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-blue-800">Activity {index + 1}</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeActivity(index)}
                  className="text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label>Activity Picture</Label>
                  <div className="mt-1 flex items-center space-x-2">
                    <input
                      id={`activity_image_${index}`}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          updateActivity(index, 'image_url', file.name);
                        }
                      }}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => document.getElementById(`activity_image_${index}`)?.click()}
                      className="flex items-center"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Image
                    </Button>
                    {activity.image_url && (
                      <span className="text-sm text-gray-600">{activity.image_url}</span>
                    )}
                  </div>
                </div>
                
                <div>
                  <Label>Activity Title</Label>
                  <Textarea
                    placeholder="Activity name"
                    value={activity.title}
                    onChange={(e) => updateActivity(index, 'title', e.target.value)}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label>Description</Label>
                  <Textarea
                    placeholder="Inspiring one short sentence description"
                    value={activity.description}
                    onChange={(e) => updateActivity(index, 'description', e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label>Icon</Label>
                  <Textarea
                    placeholder="lucide-react related icon"
                    value={activity.icon}
                    onChange={(e) => updateActivity(index, 'icon', e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label>Category</Label>
                  <Select value={activity.category} onValueChange={(value) => updateActivity(index, 'category', value)}>
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
            onClick={addActivity}
            className="mt-4"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Activity
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-blue-700">Front Desk Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          {recommendations.map((activity, index) => (
            <div key={index} className="border-2 border-blue-200 p-4 rounded-lg mt-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-blue-800">Activity {index + 1}</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeActivity(index)}
                  className="text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label>Activity Picture</Label>
                  <div className="mt-1 flex items-center space-x-2">
                    <input
                      id={`activity_image_${index}`}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          updateActivity(index, 'image_url', file.name);
                        }
                      }}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => document.getElementById(`activity_image_${index}`)?.click()}
                      className="flex items-center"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Image
                    </Button>
                    {activity.image_url && (
                      <span className="text-sm text-gray-600">{activity.image_url}</span>
                    )}
                  </div>
                </div>
                
                <div>
                  <Label>Activity Title</Label>
                  <Textarea
                    placeholder="Activity name"
                    value={activity.title}
                    onChange={(e) => updateActivity(index, 'title', e.target.value)}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label>Description</Label>
                  <Textarea
                    placeholder="Inspiring one short sentence description"
                    value={activity.description}
                    onChange={(e) => updateActivity(index, 'description', e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label>Icon</Label>
                  <Textarea
                    placeholder="lucide-react related icon"
                    value={activity.icon}
                    onChange={(e) => updateActivity(index, 'icon', e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label>Category</Label>
                  <Select value={activity.category} onValueChange={(value) => updateActivity(index, 'category', value)}>
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
            onClick={addActivity}
            className="mt-4"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Activity
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ActivitiesTab;
