import { useEffect } from 'react';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

export const useGoogleMapsScript = () => {
    useEffect(() => {
        if (!GOOGLE_MAPS_API_KEY) {
            console.warn('Google Maps API key not configured');
            return;
        }

        // Check if already loaded
        if (window.google && window.google.maps) {
            return;
        }

        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places&language=es&region=CL`;
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);

        return () => {
            // Cleanup if needed
            if (script.parentNode) {
                script.parentNode.removeChild(script);
            }
        };
    }, []);
};
