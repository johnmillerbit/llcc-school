'use client';

import { HeroUIProvider } from '@heroui/react';
import { ToastProvider } from '@heroui/toast';

export function HeroProvider({ children }: { children: React.ReactNode }) {
  return (
    <HeroUIProvider>
      <ToastProvider
        toastProps={{
          timeout: 2000,
        }}
      />
      {children}
    </HeroUIProvider>
  );
}
