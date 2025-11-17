
import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Screen, User } from '../types';
import { VanIcon } from '../constants';
import Button from '../components/Button';
import Input from '../components/Input';
import { studentSignUp, driverSignUp, login as authLogin } from '../backend/supabaseAuth';

const AuthScreen: React.FC = () => {
  const { role, login, setScreen, addNotification } = useAppContext();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    studentId: '',
    cnic: '',
    department: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        // LOGIN FLOW
        const result = await authLogin({ email: formData.email, password: formData.password });
        
        if (result.error) {
          addNotification({
            title: 'Login Failed',
            message: result.error,
            targetRole: undefined,
          });
          setIsLoading(false);
          return;
        }

        // Create user object and login with context
        const userData = result.profile;
        console.log('Logged in user data:', userData);
        const user: User = {
          id: userData.id,
          fullName: userData.name,
          email: userData.email,
          role: userData.user_type === 'student' ? 'Student' : 'Driver',
          studentId: userData.reg_no,
          cnic: userData.cnic,
          department: userData.department,
        };

        login(user);
        addNotification({
          title: 'Welcome!',
          message: `Login successful!`,
          targetRole: user.role,
        });

      } else {
        // SIGNUP FLOW
        if (!formData.email || !formData.password || !formData.fullName) {
          addNotification({
            title: 'Validation Error',
            message: 'Please fill in all required fields',
            targetRole: undefined,
          });
          setIsLoading(false);
          return;
        }

        if (role === 'Student' && !formData.studentId) {
          addNotification({
            title: 'Validation Error',
            message: 'Student ID is required',
            targetRole: undefined,
          });
          setIsLoading(false);
          return;
        }

        if (role === 'Driver' && !formData.cnic) {
          addNotification({
            title: 'Validation Error',
            message: 'CNIC is required',
            targetRole: undefined,
          });
          setIsLoading(false);
          return;
        }

        // Sign up based on role
        let result;
        if (role === 'Student') {
          result = await studentSignUp({
            name: formData.fullName,
            reg_no: formData.studentId,
            email: formData.email,
            department: formData.department,
            password: formData.password,
          });
        } else {
          result = await driverSignUp({
            name: formData.fullName,
            cnic: formData.cnic,
            email: formData.email,
            password: formData.password,
          });
        }

        if (result.error) {
          addNotification({
            title: 'Sign Up Failed',
            message: result.error,
            targetRole: undefined,
          });
          setIsLoading(false);
          return;
        }

        // Log in user after successful signup
        const loginResult = await authLogin({ email: formData.email, password: formData.password });
        if (loginResult.error) {
          addNotification({
            title: 'Auto-login Failed',
            message: loginResult.error,
            targetRole: undefined,
          });
          setIsLoading(false);
          return;
        }

        const userData = loginResult.profile;
        const user: User = {
          id: userData.id,
          fullName: userData.name,
          email: userData.email,
          role: userData.user_type === 'student' ? 'Student' : 'Driver',
          studentId: userData.reg_no,
          cnic: userData.cnic,
          department: userData.department,
        };

        login(user);
        addNotification({
          title: 'Welcome!',
          message: `Account created successfully!`,
          targetRole: user.role,
        });
      }
    } catch (error) {
      console.error('Auth error:', error);
      addNotification({
        title: 'Error',
        message: 'An unexpected error occurred',
        targetRole: undefined,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col p-8 text-white overflow-y-auto">
      <button onClick={() => setScreen(Screen.LAUNCH)} className="self-start text-pink-300 mb-4 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
          Back
      </button>
      <div className="w-full flex flex-col items-center">
        <VanIcon />
        <h1 className="text-4xl font-bold tracking-widest text-white mt-4">VROOMLY</h1>
        <p className="text-white/80 mt-2">Smart rides, Simple lives</p>
      </div>

      <div className="flex bg-[#2E2E55] rounded-lg p-1 my-8">
        <button onClick={() => setIsLogin(true)} className={`w-1/2 py-2 rounded-md font-semibold transition-colors ${isLogin ? 'bg-[#FFA8A8] text-[#3A3A69]' : 'text-white'}`}>Login</button>
        <button onClick={() => setIsLogin(false)} className={`w-1/2 py-2 rounded-md font-semibold transition-colors ${!isLogin ? 'bg-[#FFA8A8] text-[#3A3A69]' : 'text-white'}`}>Sign Up</button>
      </div>

      <div className="flex-grow">
        <h2 className="text-2xl font-bold mb-4">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          {!isLogin && (
              <>
                <Input 
                  label="Full Name" 
                  id="fullName" 
                  type="text" 
                  placeholder="John Doe" 
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required 
                />
                {role === 'Student' && (
                  <>
                    <Input 
                      label="Student ID" 
                      id="studentId" 
                      type="text" 
                      placeholder="01-00000-000"
                      value={formData.studentId}
                      onChange={handleInputChange}
                      required 
                    />
                    <Input 
                      label="Department" 
                      id="department" 
                      type="text" 
                      placeholder="Computer Science Department"
                      value={formData.department}
                      onChange={handleInputChange}
                    />
                  </>
                )}
                {role === 'Driver' && (
                  <Input 
                    label="CNIC Number" 
                    id="cnic" 
                    type="text" 
                    placeholder="0000-0000000-0"
                    value={formData.cnic}
                    onChange={handleInputChange}
                    required 
                  />
                )}
              </>
          )}
          
          <Input 
            label="Email" 
            id="email" 
            type="email" 
            placeholder={role === 'Student' ? "student@example.com" : "driver@example.com"}
            value={formData.email}
            onChange={handleInputChange}
            required 
          />
          <Input 
            label="Password" 
            id="password" 
            type="password" 
            placeholder="••••••••"
            value={formData.password}
            onChange={handleInputChange}
            required 
          />
          
          <div className="pt-4">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Processing...' : (isLogin ? 'LOGIN' : 'SIGN UP')}
            </Button>
          </div>
        </form>
        
        <div className="text-center mt-4">
          {isLogin ? (
            <>
              <button onClick={() => setScreen(Screen.FORGOT_PASSWORD)} className="text-sm text-pink-300 hover:underline">Forgot password?</button>
              <p className="text-sm text-white/70 mt-2">
                Don't have an account? <button onClick={() => setIsLogin(false)} className="font-semibold text-pink-300 hover:underline">Sign Up</button>
              </p>
            </>
          ) : (
            <p className="text-sm text-white/70">
              Already have an account? <button onClick={() => setIsLogin(true)} className="font-semibold text-pink-300 hover:underline">Login</button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;