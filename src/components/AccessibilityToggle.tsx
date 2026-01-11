import React from 'react';
import { Eye, Wind, Type, Accessibility } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useAccessibility } from '@/hooks/use-accessibility';
export function AccessibilityToggle() {
  const { 
    highContrast, 
    reducedMotion, 
    dyslexicFriendly, 
    toggleHighContrast, 
    toggleReducedMotion, 
    toggleDyslexicFriendly 
  } = useAccessibility();
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="hover:scale-110 transition-transform" aria-label="Accessibility Settings">
          <Accessibility className="h-5 w-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-6" align="end">
        <div className="space-y-6">
          <div className="flex flex-col gap-1">
            <h4 className="font-black uppercase text-[10px] tracking-widest text-muted-foreground">Universal Access</h4>
            <p className="text-xs text-muted-foreground">Adjust settings for your specific reading needs.</p>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4 text-amber-500" />
                <Label htmlFor="high-contrast" className="text-sm font-bold">High Contrast</Label>
              </div>
              <Switch id="high-contrast" checked={highContrast} onCheckedChange={toggleHighContrast} />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Type className="h-4 w-4 text-indigo-500" />
                <Label htmlFor="dyslexic-font" className="text-sm font-bold">Dyslexic Friendly</Label>
              </div>
              <Switch id="dyslexic-font" checked={dyslexicFriendly} onCheckedChange={toggleDyslexicFriendly} />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wind className="h-4 w-4 text-emerald-500" />
                <Label htmlFor="reduced-motion" className="text-sm font-bold">Reduced Motion</Label>
              </div>
              <Switch id="reduced-motion" checked={reducedMotion} onCheckedChange={toggleReducedMotion} />
            </div>
          </div>
          <div className="pt-4 border-t">
            <p className="text-[10px] text-center text-muted-foreground italic">Meeting WCAG 2.1 AA Standards for PA Residents</p>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}