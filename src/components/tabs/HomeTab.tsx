import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Save, Plus, Trash2, Upload } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

interface HeroAmenity {
  id: number | null;
  title: string;
  home_id?: number;
}

interface Activity {
  id: number | null;
  title: string;
  icon: string;
  home_id?: number;
}

interface Amenity {
  id: number | null;
  title: string;
  description: string;
  image_url: string;
  home_id?: number;
}

interface Attraction {
  id: number | null;
  title: string;
  distance: string;
  description: string;
  image_url: string;
  home_id?: number;
}

interface HomeTabProps {
  onSave: (data: any) => void;
  clientId: number;
}

const HomeTab: React.FC<HomeTabProps> = ({ onSave, clientId }) => {
  const [formData, setFormData] = useState({
    id: null as number | null, // Added to store the main home entry ID
    hero_image: '',
    intro_image: '',
    activities_image: '',
    hero_title: '',
    hero_subtitle: '',
    hero_amenity_list: [] as HeroAmenity[],
    intro_title: '',
    intro_subtitle: '',
    amenities_gallery_subtitle: '',
    activities_subtitle: '',
    activities: [] as Activity[],
    amenities_subtitle: '',
    amenities: [] as Amenity[],
    rule_check_in_out_time: '',
    rule_quiet_time: '',
    rule_campfire: '',
    rule_pets: '',
    rule_wifi: '',
    cta_title: '',
    cta_subtitle: '',
    attractions_subtitle: '',
    attractions: [] as Attraction[],
  });

  const [originalHeroAmenities, setOriginalHeroAmenities] = useState<HeroAmenity[]>([]);
  const [originalActivities, setOriginalActivities] = useState<Activity[]>([]);
  const [originalAmenities, setOriginalAmenities] = useState<Amenity[]>([]);
  const [originalAttractions, setOriginalAttractions] = useState<Attraction[]>([]);

  const generateTempId = () => Date.now() + Math.random();

  const supabaseHeaders = {
    'Content-Type': 'application/json',
    'apikey': `${import.meta.env.VITE_KEY}`,
    'Authorization': `Bearer ${import.meta.env.VITE_KEY}`,
    'Prefer': 'return=representation'
  };

  const gatherData = useCallback(async () => {
    try {
      // Fetch main home data
      const homeResponse = await fetch(`https://bmlrxdnnxhawrhncbvoz.supabase.co/rest/v1/home?client_id=eq.${clientId}`, {
        method: 'GET',
        headers: supabaseHeaders,
      });
      const fetchedHomeData = await homeResponse.json();
      const initialHomeData = fetchedHomeData[0] || {
        id: null,
        hero_image: '',
        intro_image: '',
        activities_image: '',
        hero_title: '',
        hero_subtitle: '',
        intro_title: '',
        intro_subtitle: '',
        amenities_gallery_subtitle: '',
        activities_subtitle: '',
        amenities_subtitle: '',
        rule_check_in_out_time: '',
        rule_quiet_time: '',
        rule_campfire: '',
        rule_pets: '',
        rule_wifi: '',
        cta_title: '',
        cta_subtitle: '',
        attractions_subtitle: '',
      };

      let fetchedHeroAmenities: HeroAmenity[] = [];
      let fetchedActivities: Activity[] = [];
      let fetchedAmenities: Amenity[] = [];
      let fetchedAttractions: Attraction[] = [];

      if (initialHomeData.id) {
        // Fetch hero amenities
        const heroAmenitiesResponse = await fetch(`https://bmlrxdnnxhawrhncbvoz.supabase.co/rest/v1/home_hero_amenity?home_id=eq.${initialHomeData.id}`, { headers: supabaseHeaders });
        fetchedHeroAmenities = await heroAmenitiesResponse.json();

        // Fetch activities
        const activitiesResponse = await fetch(`https://bmlrxdnnxhawrhncbvoz.supabase.co/rest/v1/home_activity?home_id=eq.${initialHomeData.id}`, { headers: supabaseHeaders });
        fetchedActivities = await activitiesResponse.json();

        // Fetch amenities
        const amenitiesResponse = await fetch(`https://bmlrxdnnxhawrhncbvoz.supabase.co/rest/v1/home_amenity?home_id=eq.${initialHomeData.id}`, { headers: supabaseHeaders });
        fetchedAmenities = await amenitiesResponse.json();

        // Fetch attractions
        const attractionsResponse = await fetch(`https://bmlrxdnnxhawrhncbvoz.supabase.co/rest/v1/home_attraction?home_id=eq.${initialHomeData.id}`, { headers: supabaseHeaders });
        fetchedAttractions = await attractionsResponse.json();
      }

      setFormData(prev => ({
        ...prev,
        ...initialHomeData,
        hero_amenity_list: fetchedHeroAmenities,
        activities: fetchedActivities,
        amenities: fetchedAmenities,
        attractions: fetchedAttractions,
      }));

      // Store original data for comparison during save
      setOriginalHeroAmenities(fetchedHeroAmenities);
      setOriginalActivities(fetchedActivities);
      setOriginalAmenities(fetchedAmenities);
      setOriginalAttractions(fetchedAttractions);

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

  const updateListItem = <T extends { id: number | null }>(
    listName: keyof typeof formData,
    id: number | null,
    field: keyof T,
    value: string
  ) => {
    setFormData(prev => {
      const currentList = prev[listName] as T[];
      if (Array.isArray(currentList)) {
        return {
          ...prev,
          [listName]: currentList.map((item) =>
            item.id === id ? { ...item, [field]: value } : item
          )
        };
      }
      return prev;
    });
  };

  const addListItem = (listName: keyof typeof formData, template: any) => {
    setFormData(prev => {
      const currentList = prev[listName];
      if (Array.isArray(currentList)) {
        return {
          ...prev,
          [listName]: [...currentList, { id: generateTempId(), ...template, home_id: formData.id }]
        };
      }
      return prev;
    });
  };

  const removeListItem = (listName: keyof typeof formData, id: number | null) => {
    setFormData(prev => {
      const currentList = prev[listName];
      if (Array.isArray(currentList)) {
        return {
          ...prev,
          [listName]: currentList.filter((item: any) => item.id !== id)
        };
      }
      return prev;
    });
  };

  const handleSave = async () => {
    try {
      const allPromises: Promise<any>[] = [];

      // --- Handle Main Home Data ---
      const mainHomeToSave = {
        hero_image: formData.hero_image,
        intro_image: formData.intro_image,
        activities_image: formData.activities_image,
        hero_title: formData.hero_title,
        hero_subtitle: formData.hero_subtitle,
        intro_title: formData.intro_title,
        intro_subtitle: formData.intro_subtitle,
        amenities_gallery_subtitle: formData.amenities_gallery_subtitle,
        activities_subtitle: formData.activities_subtitle,
        amenities_subtitle: formData.amenities_subtitle,
        rule_check_in_out_time: formData.rule_check_in_out_time,
        rule_quiet_time: formData.rule_quiet_time,
        rule_campfire: formData.rule_campfire,
        rule_pets: formData.rule_pets,
        rule_wifi: formData.rule_wifi,
        cta_title: formData.cta_title,
        cta_subtitle: formData.cta_subtitle,
        attractions_subtitle: formData.attractions_subtitle,
        client_id: clientId,
      };

      if (formData.id) {
        allPromises.push(
          fetch(`https://bmlrxdnnxhawrhncbvoz.supabase.co/rest/v1/home?id=eq.${formData.id}`, {
            method: 'PATCH',
            headers: supabaseHeaders,
            body: JSON.stringify(mainHomeToSave)
          }).then(res => res.json())
        );
      } else {
        allPromises.push(
          fetch(`https://bmlrxdnnxhawrhncbvoz.supabase.co/rest/v1/home`, {
            method: 'POST',
            headers: supabaseHeaders,
            body: JSON.stringify(mainHomeToSave)
          }).then(res => res.json())
        );
      }

      // --- Helper for List Item Saves ---
      const handleListSave = async <T extends { id: number | null }>(
        currentItems: T[],
        originalItems: T[],
        tableName: string,
        itemKeys: (keyof T)[]
      ) => {
        const itemsToRemove = originalItems
          .filter(originalItem => !currentItems.some(currentItem => currentItem.id === originalItem.id))
          .map(item => item.id);

        for (const id of itemsToRemove) {
          if (id !== null) {
            allPromises.push(
              fetch(`https://bmlrxdnnxhawrhncbvoz.supabase.co/rest/v1/${tableName}?id=eq.${id}`, {
                method: 'DELETE',
                headers: supabaseHeaders,
              }).then(res => res.json())
            );
          }
        }

        for (const item of currentItems) {
          if (item.id && originalItems.some(orig => orig.id === item.id)) {
            const originalItem = originalItems.find(orig => orig.id === item.id);
            if (originalItem) {
              const hasChanged = itemKeys.some(key => originalItem[key] !== item[key]);
              if (hasChanged) {
                const body: Partial<T> = {};
                itemKeys.forEach(key => {
                  body[key] = item[key];
                });
                allPromises.push(
                  fetch(`https://bmlrxdnnxhawrhncbvoz.supabase.co/rest/v1/${tableName}?id=eq.${item.id}`, {
                    method: 'PATCH',
                    headers: supabaseHeaders,
                    body: JSON.stringify({ ...body, home_id: formData.id })
                  }).then(res => res.json())
                );
              }
            }
          } else {
            const body: Partial<T> = {};
            itemKeys.forEach(key => {
              body[key] = item[key];
            });
            allPromises.push(
              fetch(`https://bmlrxdnnxhawrhncbvoz.supabase.co/rest/v1/${tableName}`, {
                method: 'POST',
                headers: supabaseHeaders,
                body: JSON.stringify({ ...body, home_id: formData.id })
              }).then(res => res.json())
            );
          }
        }
      };

      // --- Handle List Items ---
      await handleListSave<HeroAmenity>(formData.hero_amenity_list, originalHeroAmenities, 'home_hero_amenity', ['title']);
      await handleListSave<Activity>(formData.activities, originalActivities, 'home_activity', ['title', 'icon']);
      await handleListSave<Amenity>(formData.amenities, originalAmenities, 'home_amenity', ['title', 'description', 'image_url']);
      await handleListSave<Attraction>(formData.attractions, originalAttractions, 'home_attraction', ['title', 'distance', 'description', 'image_url']);

      await Promise.all(allPromises);
      await gatherData(); // Re-fetch to get actual IDs for new items and sync state

      onSave(formData); // Notify parent component of save
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  const handlePicture = async (event, filePath) => {
    const file = event.target.files[0];

    if (!file) {
      return;
    }

    const fileName = `${clientId}/${filePath}/heroImage`;

    const { data, error } = await supabase
    .storage
    .from('premium-websites-media')
    .upload(fileName, file, {upsert: true})

    if (data) {
      const { data, error } = await supabase
      .from('home')
      .update({hero_image: `https://bmlrxdnnxhawrhncbvoz.supabase.co/storage/v1/object/public/${data.fullPath}`})
      .eq('id', clientId)
    } else {
      console.log(error)
    }
  }

  const heroImageInputRef = useRef<HTMLInputElement>(null);

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
                onChange={(e) => {handlePicture(e, 'home/hero/')}}
                ref={heroImageInputRef}
              />
              <Button
                variant="outline"
                onClick={() => heroImageInputRef.current?.click()}
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

          <div>
            <Label>Hero Amenity List</Label>
            {formData.hero_amenity_list.map((amenity, index) => (
              <div key={`${amenity.id}-${index}`} className="flex gap-2 mt-2">
                <Textarea
                  placeholder="Amenity title"
                  value={amenity.title}
                  onChange={(e) => updateListItem<HeroAmenity>('hero_amenity_list', amenity.id, 'title', e.target.value)}
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeListItem('hero_amenity_list', amenity.id)}
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
          <CardTitle className="text-lg ">Introduction Section</CardTitle>
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
          <CardTitle className="text-lg ">Activities Section</CardTitle>
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
              placeholder="Enter activities subtitle"
              value={formData.activities_subtitle}
              onChange={(e) => updateField('activities_subtitle', e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <Label>Activities List</Label>
            {formData.activities.map((activity, index) => (
              <div key={`${activity.id}-${index}`} className="border p-4 rounded-lg mt-2">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium">Activity {index + 1}</h4>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeListItem('activities', activity.id)}
                    className="text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <div className="space-y-2">
                  <Textarea
                    placeholder="Activity in a sentence that invites to do it."
                    value={activity.title}
                    onChange={(e) => updateListItem<Activity>('activities', activity.id, 'title', e.target.value)}
                  />
                  <Textarea
                    placeholder="lucide-react related icon"
                    value={activity.icon}
                    onChange={(e) => updateListItem<Activity>('activities', activity.id, 'icon', e.target.value)}
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
          <CardTitle className="text-lg ">Amenities Section</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="amenities_subtitle">Amenities Subtitle</Label>
            <Textarea
              id="amenities_subtitle"
              placeholder="Enter amenities subtitle"
              value={formData.amenities_subtitle}
              onChange={(e) => updateField('amenities_subtitle', e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <Label>Amenities List</Label>
            {formData.amenities.map((amenity, index) => (
              <div key={`${amenity.id}-${index}`} className="border p-4 rounded-lg mt-2">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium">Amenity {index + 1}</h4>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeListItem('amenities', amenity.id)}
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
                        id={`amenity_image_${amenity.id}`}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            updateListItem<Amenity>('amenities', amenity.id, 'image_url', file.name);
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
                  <Textarea
                    placeholder="Amenity name."
                    value={amenity.title}
                    onChange={(e) => updateListItem<Amenity>('amenities', amenity.id, 'title', e.target.value)}
                  />
                  <Textarea
                    placeholder="One sentence describing the amenity"
                    value={amenity.description}
                    onChange={(e) => updateListItem<Amenity>('amenities', amenity.id, 'description', e.target.value)}
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
          <CardTitle className="text-lg ">Park Rules</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="rule_check_in_out_time">Check-in/Check-out Time</Label>
            <Textarea
              id="rule_check_in_out_time"
              placeholder="Enter check-in/check-out time"
              value={formData.rule_check_in_out_time}
              onChange={(e) => updateField('rule_check_in_out_time', e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="rule_quiet_time">Quiet Time</Label>
            <Textarea
              id="rule_quiet_time"
              placeholder="Enter quiet time rules"
              value={formData.rule_quiet_time}
              onChange={(e) => updateField('rule_quiet_time', e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="rule_campfire">Campfire Rules</Label>
            <Textarea
              id="rule_campfire"
              placeholder="Enter campfire rules"
              value={formData.rule_campfire}
              onChange={(e) => updateField('rule_campfire', e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="rule_pets">Pet Policy</Label>
            <Textarea
              id="rule_pets"
              placeholder="Enter pet policy"
              value={formData.rule_pets}
              onChange={(e) => updateField('rule_pets', e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="rule_wifi">WiFi Policy</Label>
            <Textarea
              id="rule_wifi"
              placeholder="Enter WiFi policy"
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
          <CardTitle className="text-lg ">Nearby Attractions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="attractions_subtitle">Attractions Subtitle</Label>
            <Textarea
              id="attractions_subtitle"
              placeholder="Enter attractions subtitle"
              value={formData.attractions_subtitle}
              onChange={(e) => updateField('attractions_subtitle', e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <Label>Attractions List</Label>
            {formData.attractions.map((attraction, index) => (
              <div key={`${attraction.id}-${index}`} className="border p-4 rounded-lg mt-2">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium">Attraction {index + 1}</h4>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeListItem('attractions', attraction.id)}
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
                        id={`attraction_image_${attraction.id}`}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            updateListItem<Attraction>('attractions', attraction.id, 'image_url', file.name);
                          }
                        }}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => document.getElementById(`attraction_image_${attraction.id}`)?.click()}
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
                    onChange={(e) => updateListItem<Attraction>('attractions', attraction.id, 'title', e.target.value)}
                  />
                  <Textarea
                    placeholder="Distance in minutes from park"
                    value={attraction.distance}
                    onChange={(e) => updateListItem<Attraction>('attractions', attraction.id, 'distance', e.target.value)}
                  />
                  <Textarea
                    placeholder="One sentence describing the amenity"
                    value={attraction.description}
                    onChange={(e) => updateListItem<Attraction>('attractions', attraction.id, 'description', e.target.value)}
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