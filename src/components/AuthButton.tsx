
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { LogInIcon, LogOutIcon, UserIcon } from "lucide-react";

const AuthButton = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  if (loading) {
    return <Button variant="ghost" size="icon" disabled><UserIcon size={20} /></Button>;
  }

  if (user) {
    return (
      <Button variant="ghost" size="icon" onClick={handleSignOut} title="Sign Out">
        <LogOutIcon size={20} />
      </Button>
    );
  }

  return (
    <Button variant="ghost" size="icon" onClick={() => navigate("/auth")} title="Sign In">
      <LogInIcon size={20} />
    </Button>
  );
};

export default AuthButton;
