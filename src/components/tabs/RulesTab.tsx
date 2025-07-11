import React, { useEffect, useState, useCallback } from 'react'; // Import useCallback
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Save, Plus, Trash2, Upload } from 'lucide-react';

interface Rule {
  id: number | null; // Null for new items
  title: string;
  category: string;
  client_id?: number;
}

interface Faq {
  id: number | null; // Null for new items
  question: string;
  answer: string;
  type: string;
  client_id?: number;
}

interface RulesTabProps {
  onSave: (data: any) => void;
  clientId: number
}

const RulesTab: React.FC<RulesTabProps> = ({ onSave, clientId }) => {
  const [formData, setFormData] = useState({
    rules_image: '',
    rules: [] as Rule[],
    faqs: [] as Faq[]
  });

  const [originalRules, setOriginalRules] = useState<Rule[]>([]);
  const [originalFaqs, setOriginalFaqs] = useState<Faq[]>([]);

  const generateTempId = () => Date.now() + Math.random();

  // Move gatherData outside of useEffect
  const gatherData = useCallback(async () => {
    try {
      const rulesResponse = await fetch(`https://bmlrxdnnxhawrhncbvoz.supabase.co/rest/v1/rules?client_id=eq.${clientId}`, {
        method: 'GET',
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJtbHJ4ZG5ueGhhd3JobmNidm96Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTU1Mjc4NSwiZXhwIjoyMDY1MTI4Nzg1fQ.nxB9n8R4OjPaAdCYc8CooJYfx5OVLxcs_Xs3ZKW295I',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJtbHJ4ZG5ueGhhd3JobmNidm96Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTU1Mjc4NSwiZXhwIjoyMDY1MTI4Nzg1fQ.nxB9n8R4OjPaAdCYc8CooJYfx5OVLxcs_Xs3ZKW295I',
        }
      });
      const fetchedRules = await rulesResponse.json();

      const faqsResponse = await fetch(`https://bmlrxdnnxhawrhncbvoz.supabase.co/rest/v1/faqs?client_id=eq.${clientId}`, {
        method: 'GET',
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJtbHJ4ZG5ueGhhd3JobmNidm96Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTU1Mjc4NSwiZXhwIjoyMDY1MTI4Nzg1fQ.nxB9n8R4OjPaAdCYc8CooJYfx5OVLxcs_Xs3ZKW295I',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJtbHJ4ZG5ueGhhd3JobmNidm96Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTU1Mjc4NSwiZXhwIjoyMDY1MTI4Nzg1fQ.nxB9n8R4OjPaAdCYc8CooJYfx5OVLxcs_Xs3ZKW295I',
        }
      });
      const fetchedFaqs = await faqsResponse.json();

      setFormData(prev => ({
        ...prev,
        rules: fetchedRules.length > 0 ? fetchedRules : [{ id: generateTempId(), title: '', category: '0', client_id: clientId }],
        faqs: fetchedFaqs.length > 0 ? fetchedFaqs : [{ id: generateTempId(), question: '', answer: '', type: '0', client_id: clientId }]
      }));
      setOriginalRules(fetchedRules);
      setOriginalFaqs(fetchedFaqs);

    } catch (error) {
      console.error("Error gathering initial data:", error);
    }
  }, [clientId]); // Add clientId to useCallback's dependency array

  // Now, call gatherData inside useEffect
  useEffect(() => {
    gatherData();
  }, [gatherData]); // Add gatherData to useEffect's dependency array

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateRule = (id: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      rules: prev.rules.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    }));
  };

  const updateFaq = (id: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      faqs: prev.faqs.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    }));
  };

  const addRule = () => {
    setFormData(prev => ({
      ...prev,
      rules: [...prev.rules, { id: generateTempId(), title: '', category: '0', client_id: clientId }]
    }));
  };

  const removeRule = (id: number) => {
    setFormData(prev => ({
      ...prev,
      rules: prev.rules.filter((item) => item.id !== id)
    }));
  };

  const addFaq = () => {
    setFormData(prev => ({
      ...prev,
      faqs: [...prev.faqs, { id: generateTempId(), question: '', answer: '', type: '0', client_id: clientId }]
    }));
  };

  const removeFaq = (id: number) => {
    setFormData(prev => ({
      ...prev,
      faqs: prev.faqs.filter((item) => item.id !== id)
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

  const supabaseHeaders = {
    'Content-Type': 'application/json',
    'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJtbHJ4ZG5ueGhhd3JobmNidm96Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTU1Mjc4NSwiZXhwIjoyMDY1MTI4Nzg1fQ.nxB9n8R4OjPaAdCYc8CooJYfx5OVLxcs_Xs3ZKW295I',
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJtbHJ4ZG5ueGhhd3JobmNidm96Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTU1Mjc4NSwiZXhwIjoyMDY1MTI4Nzg1fQ.nxB9n8R4OjPaAdCYc8CooJYfx5OVLxcs_Xs3ZKW295I',
    'Prefer': 'return=representation'
  };

  const handleSave = async () => {
    try {
      const allPromises: Promise<any>[] = [];

      // --- Handle Rules ---
      const ruleIdsToRemove = originalRules
        .filter(originalRule => !formData.rules.some(currentRule => currentRule.id === originalRule.id))
        .map(rule => rule.id);

      for (const id of ruleIdsToRemove) {
        if (id !== null) {
          allPromises.push(
            fetch(`https://bmlrxdnnxhawrhncbvoz.supabase.co/rest/v1/rules?id=eq.${id}`, {
              method: 'DELETE',
              headers: supabaseHeaders,
            }).then(res => res.json())
          );
        }
      }

      for (const rule of formData.rules) {
        if (rule.id && originalRules.some(orig => orig.id === rule.id)) {
          const originalRule = originalRules.find(orig => orig.id === rule.id);
          if (originalRule && (originalRule.title !== rule.title || originalRule.category !== rule.category)) {
            allPromises.push(
              fetch(`https://bmlrxdnnxhawrhncbvoz.supabase.co/rest/v1/rules?id=eq.${rule.id}`, {
                method: 'PATCH',
                headers: supabaseHeaders,
                body: JSON.stringify({ title: rule.title, category: rule.category, client_id: clientId })
              }).then(res => res.json())
            );
          }
        } else {
          allPromises.push(
            fetch(`https://bmlrxdnnxhawrhncbvoz.supabase.co/rest/v1/rules`, {
              method: 'POST',
              headers: supabaseHeaders,
              body: JSON.stringify({ title: rule.title, category: rule.category, client_id: clientId })
            }).then(res => res.json())
          );
        }
      }

      // --- Handle FAQs ---
      const faqIdsToRemove = originalFaqs
        .filter(originalFaq => !formData.faqs.some(currentFaq => currentFaq.id === originalFaq.id))
        .map(faq => faq.id);

      for (const id of faqIdsToRemove) {
        if (id !== null) {
          allPromises.push(
            fetch(`https://bmlrxdnnxhawrhncbvoz.supabase.co/rest/v1/faqs?id=eq.${id}`, {
              method: 'DELETE',
              headers: supabaseHeaders,
            }).then(res => res.json())
          );
        }
      }

      for (const faq of formData.faqs) {
        if (faq.id && originalFaqs.some(orig => orig.id === faq.id)) {
          const originalFaq = originalFaqs.find(orig => orig.id === faq.id);
          if (originalFaq && (originalFaq.question !== faq.question || originalFaq.answer !== faq.answer || originalFaq.type !== faq.type)) {
            allPromises.push(
              fetch(`https://bmlrxdnnxhawrhncbvoz.supabase.co/rest/v1/faqs?id=eq.${faq.id}`, {
                method: 'PATCH',
                headers: supabaseHeaders,
                body: JSON.stringify({ question: faq.question, answer: faq.answer, type: faq.type, client_id: clientId })
              }).then(res => res.json())
            );
          }
        } else {
          allPromises.push(
            fetch(`https://bmlrxdnnxhawrhncbvoz.supabase.co/rest/v1/faqs`, {
              method: 'POST',
              headers: supabaseHeaders,
              body: JSON.stringify({ question: faq.question, answer: faq.answer, type: faq.type, client_id: clientId })
            }).then(res => res.json())
          );
        }
      }

      await Promise.all(allPromises); // `results` variable was not defined, use the one from `Promise.all`

      // After successful save, re-fetch data to get actual IDs for newly created items
      // and ensure the local state is in sync with the database.
      await gatherData();

      onSave(formData);
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

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
          <CardTitle className="text-lg ">Page Header</CardTitle>
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
          <CardTitle className="text-lg ">Rules List</CardTitle>
        </CardHeader>
        <CardContent>
          {formData.rules.map((rule) => (
            <div key={rule.id!} className="border-2 border-blue-200 p-4 rounded-lg mt-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-blue-800">Rule</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeRule(rule.id!)}
                  className="text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <Label>Rule</Label>
                  <Textarea
                    placeholder="Enter rule title"
                    value={rule.title}
                    onChange={(e) => updateRule(rule.id!, 'title', e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label>Category</Label>
                  <Select value={rule.category} onValueChange={(value) => updateRule(rule.id!, 'category', value)}>
                    <SelectTrigger className="mt-1">
                      {/* Corrected: SelectValue automatically displays the label of the matched SelectItem */}
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
          <CardTitle className="text-lg ">Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent>
          {formData.faqs.map((faq) => (
            <div key={faq.id!} className="border-2 border-blue-200 p-4 rounded-lg mt-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-blue-800">FAQ</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeFaq(faq.id!)}
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
                    onChange={(e) => updateFaq(faq.id!, 'question', e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label>Answer</Label>
                  <Textarea
                    placeholder="FAQ answer"
                    value={faq.answer}
                    onChange={(e) => updateFaq(faq.id!, 'answer', e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label>Type</Label>
                  <Select value={faq.type} onValueChange={(value) => updateFaq(faq.id!, 'type', value)}>
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