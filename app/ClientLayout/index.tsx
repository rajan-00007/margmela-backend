'use client';
import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { ApiProvider, useApi } from '../context/ApiContext';
import Sidebar from '../../components/layout/Sidebar';
import Header from '../../components/layout/Header';
import {
  LoadingViewport,
  Spinner,
  LoadingText,
  StandaloneViewport,
  ShellWrapper,
  MainViewport,
  ContentArea,
} from './styled';

function DashboardLayoutContent({ children }: { children: React.ReactNode }) {
  const { token, loading, backendUrl, selectedEvent, logout } = useApi();
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  useEffect(() => {
    // If finished loading, has no token, and not on login page, redirect to '/'
    if (!loading && !token && pathname !== '/') {
      router.push('/');
    }
  }, [token, loading, pathname, router]);

  // Auto-close sidebar on mobile when route changes
  useEffect(() => {
    setIsMobileSidebarOpen(false);
  }, [pathname]);

  if (loading) {
    return (
      <LoadingViewport>
        <Spinner />
        <LoadingText>Loading MelaMarg Admin...</LoadingText>
      </LoadingViewport>
    );
  }

  // If not logged in, show standalone login viewport
  if (!token) {
    if (pathname !== '/') {
      return (
        <LoadingViewport>
          <Spinner />
          <LoadingText>Redirecting to login...</LoadingText>
        </LoadingViewport>
      );
    }
    return <StandaloneViewport>{children}</StandaloneViewport>;
  }

  // If logged in
  return (
    <ShellWrapper>
      {/* Sleek styled navigation sidebar with responsive state */}
      <Sidebar
        token={token}
        logout={logout}
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Administrative viewport panel */}
      <MainViewport>
        <Header
          backendUrl={backendUrl}
          selectedEvent={selectedEvent}
          token={token}
          onToggleSidebar={() => setIsMobileSidebarOpen(prev => !prev)}
        />

        {/* Nested route content page containers */}
        <ContentArea>{children}</ContentArea>
      </MainViewport>
    </ShellWrapper>
  );
}

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <ApiProvider>
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </ApiProvider>
  );
}
