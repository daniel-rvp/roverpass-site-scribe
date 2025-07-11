import { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import LoginPage from "./components/LoginPage";
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

const queryClient = new QueryClient();

const App = () => {

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [clientId, setClientId] = useState(0);


  const handleLogin = (credentials) => {
    if (credentials.username && credentials.password) {
      fetch(`http://ai-app.roverpass.com/authentication/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: credentials.username,
          password: credentials.password
        })
      })
      .then(res => {
        if (!res.ok) {
          return res.json().then(err => { throw new Error(err.detail || 'Login failed'); });
        }
        return res.json();
      })
      .then(async (djangoAuthResponse) => {
        if (!djangoAuthResponse.token) {
            throw new Error("Authentication failed: No token received.");
        }

        const { data: clientsData, error: supabaseError } = await supabase
          .from('clients')
          .select('id')
          .eq('token', djangoAuthResponse.token);

        if (supabaseError) {
          console.error("Supabase error fetching client ID:", supabaseError.message);
          throw new Error("Failed to verify client: " + supabaseError.message);
        }

        if (clientsData && clientsData.length > 0) {
          const fetchedClientId = clientsData[0].id;
          setClientId(fetchedClientId);
          setIsAuthenticated(true);
        } else {
          console.error("No client found for the provided token in Supabase.");
          setIsAuthenticated(false);
        }
      })
      .catch((err) => {
        console.error("Login process failed:", err.message);
        setIsAuthenticated(false);
      });
    } else {
      console.warn("Username and password cannot be empty.");
      setIsAuthenticated(false);
    }
  };


  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>

            {!isAuthenticated ? (

              <Route path="/" element={<LoginPage onLogin={handleLogin}/>} />
            ) : (

              <>

                <Route path="/:clientIdParam" element={<Index clientId={clientId}/>} />

                <Route path="/" element={<AuthenticatedRedirect clientId={clientId} />} />

                <Route path="*" element={<NotFound />} />
              </>
            )}
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};


const AuthenticatedRedirect = ({ clientId }) => {
  const navigate = useNavigate(); 

  useEffect(() => {
    if (clientId !== 0) { 
      navigate(`/${clientId}`, { replace: true });
    }
  }, [clientId, navigate]);

  return null; 
};

export default App;