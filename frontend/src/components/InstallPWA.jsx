import React, { useState, useEffect } from 'react';

const InstallPWA = () => {
  const [installPrompt, setInstallPrompt] = useState(null);
  const [isAppInstalled, setIsAppInstalled] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (event) => {
      // Prevent the default prompt
      event.preventDefault();
      // Stash the event so it can be triggered later.
      setInstallPrompt(event);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Listen for the appinstalled event
    window.addEventListener('appinstalled', () => {
      setIsAppInstalled(true);
      setInstallPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', () => {
        setIsAppInstalled(true);
        setInstallPrompt(null);
      });
    };
  }, []);

  const handleInstallClick = () => {
    if (installPrompt) {
      // Show the install prompt
      installPrompt.prompt();
      // Wait for the user to respond to the prompt
      installPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt');
        } else {
          console.log('User dismissed the install prompt');
        }
        setInstallPrompt(null);
      });
    }
  };

  if (!installPrompt || isAppInstalled) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white shadow-lg rounded-lg p-4 flex items-center space-x-4">
        <p className="text-gray-700">Install our app for a better experience.</p>
        <button
            onClick={handleInstallClick}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        >
            Install
        </button>
    </div>
  );
};

export default InstallPWA;
