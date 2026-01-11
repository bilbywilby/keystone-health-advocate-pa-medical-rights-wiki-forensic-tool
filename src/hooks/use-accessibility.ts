import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
interface AccessibilityState {
  highContrast: boolean;
  reducedMotion: boolean;
  dyslexicFriendly: boolean;
  toggleHighContrast: () => void;
  toggleReducedMotion: () => void;
  toggleDyslexicFriendly: () => void;
}
const AccessibilityContext = createContext<AccessibilityState | undefined>(undefined);
export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const [highContrast, setHighContrast] = useState(() => localStorage.getItem('acc_high_contrast') === 'true');
  const [reducedMotion, setReducedMotion] = useState(() => localStorage.getItem('acc_reduced_motion') === 'true');
  const [dyslexicFriendly, setDyslexicFriendly] = useState(() => localStorage.getItem('acc_dyslexic') === 'true');
  useEffect(() => {
    const root = document.documentElement;
    if (highContrast) root.classList.add('high-contrast'); else root.classList.remove('high-contrast');
    localStorage.setItem('acc_high_contrast', String(highContrast));
  }, [highContrast]);
  useEffect(() => {
    const root = document.documentElement;
    if (reducedMotion) root.classList.add('motion-reduce'); else root.classList.remove('motion-reduce');
    localStorage.setItem('acc_reduced_motion', String(reducedMotion));
  }, [reducedMotion]);
  useEffect(() => {
    const root = document.documentElement;
    if (dyslexicFriendly) root.classList.add('font-dyslexic'); else root.classList.remove('font-dyslexic');
    localStorage.setItem('acc_dyslexic', String(dyslexicFriendly));
  }, [dyslexicFriendly]);
  const toggleHighContrast = () => setHighContrast(prev => !prev);
  const toggleReducedMotion = () => setReducedMotion(prev => !prev);
  const toggleDyslexicFriendly = () => setDyslexicFriendly(prev => !prev);
  return React.createElement(AccessibilityContext.Provider, {
    value: { highContrast, reducedMotion, dyslexicFriendly, toggleHighContrast, toggleReducedMotion, toggleDyslexicFriendly }
  }, children);
}
export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
}