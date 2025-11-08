'use client';

import { ReactNode } from 'react';
import { Box } from '@mui/material';
import { Header } from './Header';
import { Footer } from './Footer';
import { Sidebar } from './Sidebar';
import { useAuth } from '@/hooks/useAuth';
import { SidebarProvider } from '@/contexts/SidebarContext';

interface LayoutProps {
  children: ReactNode;
  showHeader?: boolean;
  showFooter?: boolean;
}

function LayoutContent({ 
  children, 
  showHeader = true, 
  showFooter = true 
}: LayoutProps) {
  const { user } = useAuth();
  const isLoggedIn = !!user;

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)'
      }}
    >
      {showHeader && <Header />}
      
      <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {isLoggedIn && showHeader && (
          <Sidebar user={user} />
        )}
        
        <Box component="main" sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', width: '100%', maxWidth: '100vw', overflowX: 'hidden', boxSizing: 'border-box' }}>
          {children}
        </Box>
      </Box>
      
      {showFooter && <Footer />}
    </Box>
  );
}

export function Layout(props: LayoutProps) {
  return (
    <SidebarProvider>
      <LayoutContent {...props} />
    </SidebarProvider>
  );
}
