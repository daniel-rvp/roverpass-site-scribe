
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Save, Plus, Trash2 } from 'lucide-react';

interface RulesTabProps {
  onSave: (data: any) => void;
}

const RulesTab: React.FC<RulesTabProps> = ({ onSave }) => {
  const [formData, setFormData] = useState({
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

  const ruleCategories = [
    { value: '0', label: 'General Rule' },
    { value: '1', label: 'Pet Policy Rule' },
    { value: '2', label: 'Facilities Rule' }
  ];

  const faqTypes = [
    { value: '0', label: 'Cancellation Policy' },
    { value: '1', label: 'Pets' },
    { value: '2', label: 'RV Hookups' },
    { value: '3', label: 'Amenities' },
    { value: '4', label: 'Visitors' },
    { value: '5', label: 'WiFi' },
    { value: '6', label: 'Check-in/Check-out' },
    { value: '7', label: 'Cabin Linens' },
    { value: '8', label: 'Campfires' },
    { value: '9', label: 'Camp Store' },
    { value: '10', label: 'Laundry' },
    { value: '11', label: 'Restaurants' }
  ];

  const handleSave = () => {
    onSave(formData);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Rules & FAQs Page Content</h2>
        <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
      </div>

      {/* Rules Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-blue-700">Park Rules</CardTitle>
        </CardHeader>
        <CardContent>
          {formData.rules.map((rule, index) => (
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
                  <Label>Rule Description</Label>
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
                      {ruleCategories.map((option) => (
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
          {formData.faqs.map((faq, index) => (
            <div key={index} className="border-2 border-green-200 p-4 rounded-lg mt-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-green-800">FAQ {index + 1}</h3>
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
                    placeholder="Find the answer in the questions section"
                    value={faq.answer}
                    onChange={(e) => updateFaq(index, 'answer', e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label>Type</Label>
                  <Select value={faq.type} onValueChange={(value) => updateFaq(index, 'type', value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select FAQ type" />
                    </SelectTrigger>
                    <SelectContent>
                      {faqTypes.map((option) => (
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
