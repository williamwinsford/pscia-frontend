'use client';

import { useState, useCallback } from 'react';

export function useSidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = useCallback(() => {
    setMobileOpen(!mobileOpen);
  }, [mobileOpen]);

  const openDrawer = useCallback(() => {
    setMobileOpen(true);
  }, []);

  const closeDrawer = useCallback(() => {
    setMobileOpen(false);
  }, []);

  return {
    mobileOpen,
    handleDrawerToggle,
    openDrawer,
    closeDrawer
  };
}

