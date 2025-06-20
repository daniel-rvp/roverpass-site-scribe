
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Save, Upload } from 'lucide-react';

interface ContactTabProps {
  onSave: (data: any) => void;
}

const ContactTab: React.FC<ContactTabProps> = ({ onSave }) => {
  const [formData, setFormData] = useState({
    contact_image: '',
    address: '',
    phone: '',
    mail: '',
    hours: '',
    find_us: ''
  });

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onSave(formData);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Contact Page Content</h2>
        <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-blue-700">Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="contact_image">Contact Image</Label>
            <div className="mt-1 flex items-center space-x-2">
              <input
                id="contact_image"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    updateField('contact_image', file.name);
                  }
                }}
              />
              <Button
                variant="outline"
                onClick={() => document.getElementById('contact_image')?.click()}
                className="flex items-center"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Contact Image
              </Button>
              {formData.contact_image && (
                <span className="text-sm text-gray-600">{formData.contact_image}</span>
              )}
            </div>
          </div>
          <div>
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              placeholder="Park address"
              value={formData.address}
              onChange={(e) => updateField('address', e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Textarea
              id="phone"
              placeholder="Park phone"
              value={formData.phone}
              onChange={(e) => updateField('phone', e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="mail">Email</Label>
            <Textarea
              id="mail"
              placeholder="Park mail"
              value={formData.mail}
              onChange={(e) => updateField('mail', e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="hours">Hours</Label>
            <Textarea
              id="hours"
              placeholder="Park attention hours for contact"
              value={formData.hours}
              onChange={(e) => updateField('hours', e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="find_us">How to Find Us</Label>
            <Textarea
              id="find_us"
              placeholder="Brief 1-2 sentence description on how to get there"
              value={formData.find_us}
              onChange={(e) => updateField('find_us', e.target.value)}
              className="mt-1"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContactTab;
