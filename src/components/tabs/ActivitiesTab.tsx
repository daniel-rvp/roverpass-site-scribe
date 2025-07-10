import React, { useEffect, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Save, Plus, Trash2, Upload } from 'lucide-react';

interface Activity {
  id: number | null;
  title: string;
  description: string;
  icon: string;
  category: number;
  image_url: string;
}

interface ActivitiesTabProps {
  onSave: (data: any) => void;
  clientId: number
}

const ActivitiesTab: React.FC<ActivitiesTabProps> = ({ onSave, clientId }) => {
  const [formData, setFormData] = useState({
    id: null as number | null, // Added to store the main activities record ID
    hero_description: '',
    hero_image: '',
    activities: [] as Activity[], // Initialize as empty array
  });

  const [originalActivities, setOriginalActivities] = useState<Activity[]>([]);

  const generateTempId = () => Date.now() + Math.random();

  const categoryOptions = [
    { value: '0', label: 'Outdoor' },
    { value: '1', label: 'Family' },
    { value: '2', label: 'Cultural' },
    { value: '3', label: 'Recommendation' }
  ];

  const supabaseHeaders = {
    'Content-Type': 'application/json',
    'apikey': `${import.meta.env.VITE_KEY}`,
    'Authorization': `Bearer ${import.meta.env.VITE_KEY}`,
    'Prefer': 'return=representation'
  };

  const gatherData = useCallback(async () => {
    try {
      // Fetch main activities data
      const mainActivitiesResponse = await fetch(`https://bmlrxdnnxhawrhncbvoz.supabase.co/rest/v1/activities?client_id=eq.${clientId}`, {
        method: 'GET',
        headers: supabaseHeaders,
      });
      const fetchedMainActivities = await mainActivitiesResponse.json();

      const initialMainData = fetchedMainActivities[0] || {
        id: null,
        hero_description: '',
        hero_image: '',
      };

      setFormData(prev => ({
        ...prev,
        ...initialMainData,
      }));

      // If main activities data exists, fetch individual activity items
      if (initialMainData.id) {
        const allActivitiesResponse = await fetch(`https://bmlrxdnnxhawrhncbvoz.supabase.co/rest/v1/activities_activity?activities_id=eq.${initialMainData.id}`, {
          method: 'GET',
          headers: supabaseHeaders,
        });
        const fetchedActivities = await allActivitiesResponse.json();

        setFormData(prev => ({
          ...prev,
          activities: fetchedActivities,
        }));
        setOriginalActivities(fetchedActivities);
      } else {
        // If no main record, ensure activities are empty
        setFormData(prev => ({
          ...prev,
          activities: [],
        }));
        setOriginalActivities([]);
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

  const updateActivity = (id: number | null, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      activities: prev.activities.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    }));
  };

  const addActivity = () => {
    setFormData(prev => ({
      ...prev,
      activities: [...prev.activities, { id: generateTempId(), title: '', description: '', icon: '', category: 0, image_url: '', activities_id: formData.id || undefined }]
    }));
  };

  const removeActivity = (id: number | null) => {
    setFormData(prev => ({
      ...prev,
      activities: prev.activities.filter((item) => item.id !== id)
    }));
  };

  const handleSave = async () => {
    try {
      const allPromises: Promise<any>[] = [];

      // --- Handle Main Activities Data ---
      const mainActivitiesToSave = {
        hero_description: formData.hero_description,
        hero_image: formData.hero_image,
        client_id: clientId
      };

      // Check if main activities record exists for this client_id
      const existingMainActivities = (await (await fetch(`https://bmlrxdnnxhawrhncbvoz.supabase.co/rest/v1/activities?client_id=eq.${clientId}`, {
        method: 'GET',
        headers: supabaseHeaders,
      })).json())[0];

      let currentMainActivitiesId = formData.id;

      if (existingMainActivities) {
        // Update existing main activities record
        allPromises.push(
          fetch(`https://bmlrxdnnxhawrhncbvoz.supabase.co/rest/v1/activities?id=eq.${existingMainActivities.id}`, {
            method: 'PATCH',
            headers: supabaseHeaders,
            body: JSON.stringify(mainActivitiesToSave)
          }).then(res => res.json())
        );
        currentMainActivitiesId = existingMainActivities.id;
      } else {
        // Create new main activities record
        const response = await fetch(`https://bmlrxdnnxhawrhncbvoz.supabase.co/rest/v1/activities`, {
          method: 'POST',
          headers: supabaseHeaders,
          body: JSON.stringify(mainActivitiesToSave)
        });
        const newMainActivities = await response.json();
        if (newMainActivities && newMainActivities.length > 0) {
          currentMainActivitiesId = newMainActivities[0].id;
          setFormData(prev => ({ ...prev, id: currentMainActivitiesId })); // Update formData with new ID
        } else {
          throw new Error("Failed to create main activities record.");
        }
      }

      // Ensure currentMainActivitiesId is available for activity items
      if (!currentMainActivitiesId) {
        console.error("Main activities ID not available for saving activity items.");
        return;
      }

      // --- Handle Individual Activity Items ---
      const activityIdsToRemove = originalActivities
        .filter(originalActivity => !formData.activities.some(currentActivity => currentActivity.id === originalActivity.id))
        .map(activity => activity.id);

      for (const id of activityIdsToRemove) {
        if (id !== null) {
          allPromises.push(
            fetch(`https://bmlrxdnnxhawrhncbvoz.supabase.co/rest/v1/activities_activity?id=eq.${id}`, {
              method: 'DELETE',
              headers: supabaseHeaders,
            }).then(res => res.json())
          );
        }
      }

      for (const activity of formData.activities) {
        // Prepare activity data, ensuring activities_id is linked to the main record
        const activityToSave = {
          title: activity.title,
          description: activity.description,
          icon: activity.icon,
          category: activity.category,
          image_url: activity.image_url,
          activities_id: currentMainActivitiesId // Link to the main activities table
        };

        if (activity.id && originalActivities.some(orig => orig.id === activity.id)) {
          // Existing activity: check for updates
          const originalActivity = originalActivities.find(orig => orig.id === activity.id);
          if (originalActivity && (
            originalActivity.title !== activity.title ||
            originalActivity.description !== activity.description ||
            originalActivity.icon !== activity.icon ||
            originalActivity.category !== activity.category ||
            originalActivity.image_url !== activity.image_url
          )) {
            allPromises.push(
              fetch(`https://bmlrxdnnxhawrhncbvoz.supabase.co/rest/v1/activities_activity?id=eq.${activity.id}`, {
                method: 'PATCH',
                headers: supabaseHeaders,
                body: JSON.stringify(activityToSave)
              }).then(res => res.json())
            );
          }
        } else {
          // New activity
          allPromises.push(
            fetch(`https://bmlrxdnnxhawrhncbvoz.supabase.co/rest/v1/activities_activity`, {
              method: 'POST',
              headers: supabaseHeaders,
              body: JSON.stringify(activityToSave)
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

  // Helper to filter activities by category for rendering
  const getActivitiesByCategory = (categoryValue: number) => {
    return formData.activities.filter(activity => activity.category === categoryValue);
  };

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
            <Label htmlFor="hero_description">Hero Description</Label>
            <Textarea
              id="hero_description"
              placeholder="Enter hero description"
              value={formData.hero_description}
              onChange={(e) => updateField('hero_description', e.target.value)}
              className="mt-1"
            />
          </div>
        </CardContent>
      </Card>

      {/* Outdoor Activities List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg ">Outdoor Activities</CardTitle>
        </CardHeader>
        <CardContent>
          {getActivitiesByCategory(0).map((activity, index) => (
            <div key={activity.id} className="border-2  p-4 rounded-lg mt-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold ">Activity {index + 1}</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeActivity(activity.id!)}
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
                      id={`activity_image_${activity.id}`}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          updateActivity(activity.id!, 'image_url', file.name);
                        }
                      }}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => document.getElementById(`activity_image_${activity.id}`)?.click()}
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
                    onChange={(e) => updateActivity(activity.id!, 'title', e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label>Description</Label>
                  <Textarea
                    placeholder="Inspiring one short sentence description"
                    value={activity.description}
                    onChange={(e) => updateActivity(activity.id!, 'description', e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label>Icon</Label>
                  <Textarea
                    placeholder="lucide-react related icon"
                    value={activity.icon}
                    onChange={(e) => updateActivity(activity.id!, 'icon', e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label>Category</Label>
                  <Select value={`${activity.category}`} onValueChange={(value) => updateActivity(activity.id!, 'category', value)}>
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

      {/* Family Activities */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg ">Family Fun</CardTitle>
        </CardHeader>
        <CardContent>
          {getActivitiesByCategory(1).map((activity, index) => (
            <div key={activity.id} className="border-2  p-4 rounded-lg mt-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold ">Activity {index + 1}</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeActivity(activity.id!)}
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
                      id={`activity_image_${activity.id}`}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          updateActivity(activity.id!, 'image_url', file.name);
                        }
                      }}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => document.getElementById(`activity_image_${activity.id}`)?.click()}
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
                    onChange={(e) => updateActivity(activity.id!, 'title', e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label>Description</Label>
                  <Textarea
                    placeholder="Inspiring one short sentence description"
                    value={activity.description}
                    onChange={(e) => updateActivity(activity.id!, 'description', e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label>Icon</Label>
                  <Textarea
                    placeholder="lucide-react related icon"
                    value={activity.icon}
                    onChange={(e) => updateActivity(activity.id!, 'icon', e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label>Category</Label>
                  <Select value={`${activity.category}`} onValueChange={(value) => updateActivity(activity.id!, 'category', value)}>
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

      {/* Arts & Culture */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg ">Arts & Culture</CardTitle>
        </CardHeader>
        <CardContent>
          {getActivitiesByCategory(2).map((activity, index) => (
            <div key={activity.id} className="border-2  p-4 rounded-lg mt-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold ">Activity {index + 1}</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeActivity(activity.id!)}
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
                      id={`activity_image_${activity.id}`}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          updateActivity(activity.id!, 'image_url', file.name);
                        }
                      }}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => document.getElementById(`activity_image_${activity.id}`)?.click()}
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
                    onChange={(e) => updateActivity(activity.id!, 'title', e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label>Description</Label>
                  <Textarea
                    placeholder="Inspiring one short sentence description"
                    value={activity.description}
                    onChange={(e) => updateActivity(activity.id!, 'description', e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label>Icon</Label>
                  <Textarea
                    placeholder="lucide-react related icon"
                    value={activity.icon}
                    onChange={(e) => updateActivity(activity.id!, 'icon', e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label>Category</Label>
                  <Select value={`${activity.category}`} onValueChange={(value) => updateActivity(activity.id!, 'category', value)}>
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

      {/* Front Desk Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg ">Front Desk Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          {getActivitiesByCategory(3).map((activity, index) => (
            <div key={activity.id} className="border-2  p-4 rounded-lg mt-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold ">Activity {index + 1}</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeActivity(activity.id!)}
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
                      id={`activity_image_${activity.id}`}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          updateActivity(activity.id!, 'image_url', file.name);
                        }
                      }}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => document.getElementById(`activity_image_${activity.id}`)?.click()}
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
                    onChange={(e) => updateActivity(activity.id!, 'title', e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label>Description</Label>
                  <Textarea
                    placeholder="Inspiring one short sentence description"
                    value={activity.description}
                    onChange={(e) => updateActivity(activity.id!, 'description', e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label>Icon</Label>
                  <Textarea
                    placeholder="lucide-react related icon"
                    value={activity.icon}
                    onChange={(e) => updateActivity(activity.id!, 'icon', e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label>Category</Label>
                  <Select value={`${activity.category}`} onValueChange={(value) => updateActivity(activity.id!, 'category', value)}>
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