
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Save, Plus, Trash2, Upload } from 'lucide-react';

interface RulesTabProps {
  onSave: (data: any) => void;
  clientId: number
}

const RulesTab: React.FC<RulesTabProps> = ({ onSave, clientId }) => {
  const [formData, setFormData] = useState({
    rules_image: '',
    rules: [{
      title: '',
      category: '0'
    }],
    faqs: [{
      question: '',
      answer: '',
      type: '0'
    }]
  });

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateRule = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      rules: prev.rules.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const updateFaq = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      faqs: prev.faqs.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const addRule = () => {
    setFormData(prev => ({
      ...prev,
      rules: [...prev.rules, { title: '', category: '0' }]
    }));
  };

  const removeRule = (index: number) => {
    setFormData(prev => ({
      ...prev,
      rules: prev.rules.filter((_, i) => i !== index)
    }));
  };

  const addFaq = () => {
    setFormData(prev => ({
      ...prev,
      faqs: [...prev.faqs, { question: '', answer: '', type: '0' }]
    }));
  };

  const removeFaq = (index: number) => {
    setFormData(prev => ({
      ...prev,
      faqs: prev.faqs.filter((_, i) => i !== index)
    }));
  };

  const ruleCategoryOptions = [
    { value: '0', label: 'General Rule' },
    { value: '1', label: 'Pet Policy Rule' },
    { value: '2', label: 'Facilities Rule' }
  ];

  const faqTypeOptions = Array.from({ length: 12 }, (_, i) => ({
    value: i.toString(),
    label: `FAQ Type ${i}`
  }));

  const handleSave = () => {
    onSave(formData);
  };

  const [rules, setRules] = useState([]);
  const [answers, setAnswers] = useState([]);

  useEffect(() => {
    const gatherRulesData = async () => {
        await fetch(`https://bmlrxdnnxhawrhncbvoz.supabase.co//rest/v1/rules?client_id=eq.${clientId}`, {
          method: 'GET',
          headers: {
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJtbHJ4ZG5ueGhhd3JobmNidm96Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTU1Mjc4NSwiZXhwIjoyMDY1MTI4Nzg1fQ.nxB9n8R4OjPaAdCYc8CooJYfx5OVLxcs_Xs3ZKW295I',
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJtbHJ4ZG5ueGhhd3JobmNidm96Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTU1Mjc4NSwiZXhwIjoyMDY1MTI4Nzg1fQ.nxB9n8R4OjPaAdCYc8CooJYfx5OVLxcs_Xs3ZKW295I',
          }
        })
        .then(res => res.json())
        .then(res => {
          setRules(res);
        })
        } 
        
      gatherRulesData();
  }, [clientId])

  useEffect(() => {
    const gatherFAQsData = async () => {
        await fetch(`https://bmlrxdnnxhawrhncbvoz.supabase.co//rest/v1/faqs?client_id=eq.${clientId}`, {
          method: 'GET',
          headers: {
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJtbHJ4ZG5ueGhhd3JobmNidm96Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTU1Mjc4NSwiZXhwIjoyMDY1MTI4Nzg1fQ.nxB9n8R4OjPaAdCYc8CooJYfx5OVLxcs_Xs3ZKW295I',
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJtbHJ4ZG5ueGhhd3JobmNidm96Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTU1Mjc4NSwiZXhwIjoyMDY1MTI4Nzg1fQ.nxB9n8R4OjPaAdCYc8CooJYfx5OVLxcs_Xs3ZKW295I',
          }
        })
        .then(res => res.json())
        .then(res => {
          setAnswers(res);
        })
        } 
        
      gatherFAQsData();
  }, [clientId])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Rules Page Content</h2>
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
            <Label htmlFor="rules_image">Rules Image</Label>
            <div className="mt-1 flex items-center space-x-2">
              <input
                id="rules_image"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    updateField('rules_image', file.name);
                  }
                }}
              />
              <Button
                variant="outline"
                onClick={() => document.getElementById('rules_image')?.click()}
                className="flex items-center"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Rules Image
              </Button>
              {formData.rules_image && (
                <span className="text-sm text-gray-600">{formData.rules_image}</span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Rules Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-blue-700">Rules List</CardTitle>
        </CardHeader>
        <CardContent>
          {rules.map((rule, index) => (
            <div key={index} className="border-2 border-blue-200 p-4 rounded-lg mt-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-blue-800">Rule {index + 1}</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeRule(index)}
                  className="text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label>Rule</Label>
                  <Textarea
                    placeholder="Concise sentence with the rule"
                    value={rule.title}
                    onChange={(e) => updateRule(index, 'title', e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label>Category</Label>
                  <Select value={rule.category} onValueChange={(value) => updateRule(index, 'category', value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {ruleCategoryOptions.map((option) => (
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
            onClick={addRule}
            className="mt-4"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Rule
          </Button>
        </CardContent>
      </Card>

      {/* FAQs Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-blue-700">Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent>
          {answers.map((faq, index) => (
            <div key={index} className="border-2 border-blue-200 p-4 rounded-lg mt-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-blue-800">FAQ {index + 1}</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeFaq(index)}
                  className="text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label>Question</Label>
                  <Textarea
                    placeholder="FAQ question"
                    value={faq.question}
                    onChange={(e) => updateFaq(index, 'question', e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label>Answer</Label>
                  <Textarea
                    placeholder="FAQ answer"
                    value={faq.answer}
                    onChange={(e) => updateFaq(index, 'answer', e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label>Type</Label>
                  <Select value={faq.type} onValueChange={(value) => updateFaq(index, 'type', value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {faqTypeOptions.map((option) => (
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
            onClick={addFaq}
            className="mt-4"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add FAQ
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default RulesTab;
