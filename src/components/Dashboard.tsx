
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import HomeTab from './tabs/HomeTab';
import AboutTab from './tabs/AboutTab';
import AccommodationsTab from './tabs/AccommodationsTab';
import ActivitiesTab from './tabs/ActivitiesTab';
import AmenitiesTab from './tabs/AmenitiesTab';
import ContactTab from './tabs/ContactTab';
import ReservationsTab from './tabs/ReservationsTab';
import RulesTab from './tabs/RulesTab';

const Dashboard = ({ clientId }) => {
  const [activeTab, setActiveTab] = useState('home');

  const handleSave = (pageData: any) => {
    console.log('Saving data for page:', activeTab, pageData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-red-50">
      <div className="container mx-auto p-6">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-slate-800 mb-2">RoverPass Premium Website Dashboard</h1>
            <p className="text-slate-600 text-lg">Manage your website content with ease. Each tab corresponds to a page on your website.</p>
          </div>
          <img 
            src="https://d21q6se01pvc3d.cloudfront.net/assets/logos/roverpass-logo-6ef4a70297c9f89675416cc4ae9e586c822b3ba2f245abc4fa76b6ca1bedc20e.svg" 
            alt="Logo" 
            className="h-10 w-auto object-contain"
          />
        </div>

        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-t-lg">
            <CardTitle className="text-2xl">Content Management</CardTitle>
            <CardDescription className="text-primary-foreground/80">
              Edit your website content by selecting the appropriate page tab below
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8 bg-slate-100 rounded-none border-b">
                <TabsTrigger value="home" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Home</TabsTrigger>
                <TabsTrigger value="about" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">About</TabsTrigger>
                <TabsTrigger value="accommodations" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Accommodations</TabsTrigger>
                <TabsTrigger value="activities" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Activities</TabsTrigger>
                <TabsTrigger value="amenities" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Amenities</TabsTrigger>
                <TabsTrigger value="contact" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Contact</TabsTrigger>
                <TabsTrigger value="reservations" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Reservations</TabsTrigger>
                <TabsTrigger value="rules" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Rules</TabsTrigger>
              </TabsList>

              <div className="p-6">
                <TabsContent value="home" className="mt-0">
                  <HomeTab onSave={handleSave} clientId={clientId} />
                </TabsContent>
                <TabsContent value="about" className="mt-0">
                  <AboutTab onSave={handleSave} clientId={clientId} />
                </TabsContent>
                <TabsContent value="accommodations" className="mt-0">
                  <AccommodationsTab onSave={handleSave} clientId={clientId} />
                </TabsContent>
                <TabsContent value="activities" className="mt-0">
                  <ActivitiesTab onSave={handleSave} clientId={clientId} />
                </TabsContent>
                <TabsContent value="amenities" className="mt-0">
                  <AmenitiesTab onSave={handleSave} clientId={clientId} />
                </TabsContent>
                <TabsContent value="contact" className="mt-0">
                  <ContactTab onSave={handleSave} clientId={clientId} />
                </TabsContent>
                <TabsContent value="reservations" className="mt-0">
                  <ReservationsTab onSave={handleSave} clientId={clientId} />
                </TabsContent>
                <TabsContent value="rules" className="mt-0">
                  <RulesTab onSave={handleSave} clientId={clientId} />
                </TabsContent>
              </div>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
