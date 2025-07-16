import { useEffect } from 'react';

export function GoogleOAuthCallback() {
  useEffect(() => {
    window.opener.postMessage('GoogleOAuthSuccess', window.location.origin);
    window.close();
  }, []);

  return null;
}
