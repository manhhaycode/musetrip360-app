import * as React from 'react';
import { ThemeProvider } from 'next-themes';

export function NextThemesProvider({ children, ...props }: React.ComponentProps<typeof ThemeProvider>) {
  return <ThemeProvider {...props}>{children}</ThemeProvider>;
}
