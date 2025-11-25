import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Screen } from '../types';
import Button from '../components/Button';
import Input from '../components/Input';
import { VanIcon } from '../constants';
import { supabase } from '../backend/supabaseClient';

const ForgotPasswordScreen: React.FC = () => {
  const { setScreen, addNotification } = useAppContext();
  const [email, setEmail] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleSendLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    setLoading(false);

    if (error) {
      addNotification({
        title: 'Error',
        message: error.message,
      });
      return;
    }

    addNotification({
      title: 'Success',
      message: 'Password reset link sent to your email!',
    });
    setScreen(Screen.AUTH);
  };

  return (
    <div className="w-full h-full flex flex-col p-8 text-white bg-[#3A3A69]">
        <button onClick={() => setScreen(Screen.AUTH)} className="self-start text-pink-300 mb-8 flex items-center gap-2">
             <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
            Back to Login
        </button>

        <div className="flex flex-col items-center">
            <VanIcon />
            <h1 className="text-3xl font-bold mt-4">Forgot Password?</h1>
            <p className="text-white/80 mt-2 text-center">No worries! Enter your email and we'll send you a reset link.</p>
        </div>

      <form className="space-y-6 mt-12" onSubmit={handleSendLink}>
        <Input
          label="Email"
          id="email"
          type="email"
          placeholder="Enter your registered email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Button type="submit" disabled={loading}>{loading ? 'Sending...' : 'Send Reset Link'}</Button>
      </form>
    </div>
  );
};

export default ForgotPasswordScreen;