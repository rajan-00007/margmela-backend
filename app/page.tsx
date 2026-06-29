'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApi } from './context/ApiContext';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import {
  LoginPageContainer,
  BackgroundGlow,
  TopRightGlow,
  LoginCardWrapper,
  BrandHeader,
  LogoIcon,
  BrandTitle,
  BrandSubtitle,
  FormContainer,
  FormWrapper,
  ResetOtpButton,
  ErrorBox,
  SuccessBox,
  BrandFooter,
  PhoneInputContainer,
  PhonePrefix,
  PhoneInputField,
} from './styled';

export default function LoginPage() {
  const { token, setToken, apiFetch } = useApi();
  const router = useRouter();

  // OTP login form states
  const [phone, setPhone] = useState('');
  const [otpSessionId, setOtpSessionId] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Redirection if already authenticated
  useEffect(() => {
    if (token) {
      router.push('/events');
    }
  }, [token, router]);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '');
    setPhone(val.slice(0, 10));
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) return;

    setLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      const data = await apiFetch('/api/auth/send-otp', {
        method: 'POST',
        body: JSON.stringify({ phone: `91${phone}` }),
      });

      setOtpSessionId(data.sessionId);
      setSuccessMsg(`OTP generated! Check your backend server console logs for the 6-digit verification code.`);
    } catch (err: any) {
      setError(err.message || 'Failed to trigger OTP delivery');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode || !otpSessionId) return;

    setLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      const data = await apiFetch('/api/auth/verify-otp', {
        method: 'POST',
        body: JSON.stringify({
          sessionId: otpSessionId,
          phone: `91${phone}`,
          otpCode,
        }),
      });

      if (data.accessToken) {
        if (typeof window !== 'undefined') {
          // Proactively wipe any old tokens so they disappear from DevTools
          localStorage.removeItem('mm_test_refresh_token');
        }
        setToken(data.accessToken);
        setSuccessMsg('Successfully authenticated!');
        router.push('/events');
      } else {
        throw new Error('Verification succeeded but no access token returned');
      }
    } catch (err: any) {
      setError(err.message || 'OTP verification failed');
    } finally {
      setLoading(false);
    }
  };



  return (
    <LoginPageContainer>
      {/* Background decoration elements */}
      <BackgroundGlow />
      <TopRightGlow />

      <LoginCardWrapper className="fade-in">
        <BrandHeader>
          <LogoIcon fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 009 11V7a2 2 0 00-2-2H6a2 2 0 00-2 2v2a4 4 0 00.293 1.5M12 11a13.917 13.917 0 002.753 9.571m-3.44-2.04A13.905 13.905 0 0020 9V7a2 2 0 00-2-2h-1a2 2 0 00-2 2v2a4 4 0 00.293 1.5M12 2a10 10 0 100 20 10 10 0 000-20z" />
          </LogoIcon>
          <BrandTitle>MelaMarg</BrandTitle>
          <BrandSubtitle>ADMINISTRATOR PORTAL</BrandSubtitle>
        </BrandHeader>

        <Card $glass>
          <Card.Header style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.06)', padding: '16px 28px' }}>
            <span style={{ fontSize: '14px', fontWeight: 700, color: '#ffffff' }}>OTP Verification</span>
          </Card.Header>

          <Card.Body style={{ padding: '24px 28px 28px' }}>
            <FormContainer>
              {!otpSessionId ? (
                /* Step 1: Send OTP */
                <FormWrapper onSubmit={handleSendOtp}>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <label style={{
                      fontSize: '11px',
                      fontWeight: 600,
                      color: '#a1a1aa',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      marginBottom: '6px'
                    }}>
                      Phone Number
                    </label>
                    <PhoneInputContainer>
                      <PhonePrefix>+91</PhonePrefix>
                      <PhoneInputField
                        type="tel"
                        value={phone}
                        onChange={handlePhoneChange}
                        placeholder="9876543210"
                        required
                      />
                    </PhoneInputContainer>
                  </div>
                  <Button
                    type="submit"
                    $variant="primary"
                    $fullWidth
                    loading={loading}
                    disabled={!phone || loading}
                  >
                    Send Authentication OTP
                  </Button>
                </FormWrapper>
              ) : (
                /* Step 2: Verify OTP */
                <FormWrapper onSubmit={handleVerifyOtp}>
                  <Input
                    label="Enter 6-Digit OTP Code"
                    type="text"
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    placeholder="543210"
                    $fontMono
                    required
                    style={{
                      letterSpacing: '0.2em',
                      textAlign: 'center',
                      fontSize: '18px',
                    }}
                  />
                  <Button
                    type="submit"
                    $variant="success"
                    $fullWidth
                    loading={loading}
                    disabled={!otpCode}
                  >
                    Verify & Log In
                  </Button>
                  <ResetOtpButton 
                    type="button" 
                    onClick={() => { setOtpSessionId(''); setOtpCode(''); setError(''); setSuccessMsg(''); }}
                  >
                    Use a different phone number
                  </ResetOtpButton>
                </FormWrapper>
              )}
            </FormContainer>

            {/* Error & Success Messages */}
            {error && <ErrorBox>{error}</ErrorBox>}
            {successMsg && <SuccessBox>{successMsg}</SuccessBox>}

          </Card.Body>
        </Card>

        {/* Brand footer */}
        <BrandFooter>
          Secure system authorization required. Logging in will register access permissions to configure events, bundles, POIs, and route maps.
        </BrandFooter>
      </LoginCardWrapper>
    </LoginPageContainer>
  );
}


