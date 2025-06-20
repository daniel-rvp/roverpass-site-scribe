
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Save, Plus, Trash2 } from 'lucide-react';

interface ActivitiesTabProps {
  onSave: (data: any) => void;
}

const ActivitiesTab: React.FC<ActivitiesTabProps> = ({ onSave }) => {
  const [formData, setFormData] = useState({
    hero_description: '',
    hero_image: '',
    activities: [{
      title: '',
      description: '',
      icon: '',
      category: '0'
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
      activities: [...prev.activities, { title: '', description: '', icon: '', category: '0' }]
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
            <Label htmlFor="hero_description">Hero Description</Label>
            <Textarea
              id="hero_description"
              placeholder="Description for the activities hero section"
              value={formData.hero_description}
              onChange={(e) => updateField('hero_description', e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="hero_image">Hero Image</Label>
            <Textarea
              id="hero_image"
              placeholder="Hero image URL or description"
              value={formData.hero_image}
              onChange={(e) => updateField('hero_image', e.target.value)}
              className="mt-1"
            />
          </div>
        </CardContent>
      </Card>

      {/* Activities List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-blue-700">Activities List</CardTitle>
        </CardHeader>
        <CardContent>
          {formData.activities.map((activity, index) => (
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
