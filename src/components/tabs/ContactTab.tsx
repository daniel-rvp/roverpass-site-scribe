
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Save, Upload } from 'lucide-react';

interface ContactTabProps {
  onSave: (data: any) => void;
  clientId: number
}

const ContactTab: React.FC<ContactTabProps> = ({ onSave, clientId }) => {
  const [formData, setFormData] = useState({
    id: 0,
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
    fetch(`https://bmlrxdnnxhawrhncbvoz.supabase.co/rest/v1/contact_us?id=eq.${clientId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJtbHJ4ZG5ueGhhd3JobmNidm96Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTU1Mjc4NSwiZXhwIjoyMDY1MTI4Nzg1fQ.nxB9n8R4OjPaAdCYc8CooJYfx5OVLxcs_Xs3ZKW295I',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJtbHJ4ZG5ueGhhd3JobmNidm96Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTU1Mjc4NSwiZXhwIjoyMDY1MTI4Nzg1fQ.nxB9n8R4OjPaAdCYc8CooJYfx5OVLxcs_Xs3ZKW295I',
      },
      body: JSON.stringify(formData)
    })
    .then(res => res.json())
  };

  const [data, setData] = React.useState({
      id: 0,
      created_at: "",
      client_id: 0,
      address: "",
      phone: "",
      mail: "",
      hours: "",
      contact_image: "",
      find_us: "",
  })

  useEffect(() => {
    const gatherAboutData = async () => {
      await fetch(`https://bmlrxdnnxhawrhncbvoz.supabase.co/rest/v1/contact_us?client_id=eq.${clientId}`, {
        method: 'GET',
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJtbHJ4ZG5ueGhhd3JobmNidm96Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTU1Mjc4NSwiZXhwIjoyMDY1MTI4Nzg1fQ.nxB9n8R4OjPaAdCYc8CooJYfx5OVLxcs_Xs3ZKW295I',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJtbHJ4ZG5ueGhhd3JobmNidm96Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTU1Mjc4NSwiZXhwIjoyMDY1MTI4Nzg1fQ.nxB9n8R4OjPaAdCYc8CooJYfx5OVLxcs_Xs3ZKW295I',
        }
      })
      .then(res => res.json())
      .then(res => {
        setData(res[0]);
        setFormData(res[0]);
      })
      } 
      
    gatherAboutData();
  }, [clientId])

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
              placeholder={data.address}
              value={formData.address}
              onChange={(e) => updateField('address', e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Textarea
              id="phone"
              placeholder={data.phone}
              value={formData.phone}
              onChange={(e) => updateField('phone', e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="mail">Email</Label>
            <Textarea
              id="mail"
              placeholder={data.mail}
              value={formData.mail}
              onChange={(e) => updateField('mail', e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="hours">Hours</Label>
            <Textarea
              id="hours"
              placeholder={data.hours}
              value={formData.hours}
              onChange={(e) => updateField('hours', e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="find_us">How to Find Us</Label>
            <Textarea
              id="find_us"
              placeholder={data.find_us}
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
