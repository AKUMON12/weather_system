import InteractiveBackground from '@/components/backgrounds/InteractiveBackground';
import AuthCard from '@/components/auth/AuthCard';

interface AuthPageProps {
  onAuthSuccess: () => void;
}

const Auth = ({ onAuthSuccess }: AuthPageProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <InteractiveBackground weatherCondition="night" />
      
      {/* Ambient light effects */}
      <div className="fixed top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl pointer-events-none" />
      
      <AuthCard onAuthSuccess={onAuthSuccess} />
    </div>
  );
};

export default Auth;
