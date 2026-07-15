import { useEffect, useRef, useState } from 'react';

const GOOGLE_MAPS_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

/**
 * AddressAutocomplete
 * Props:
 *   value        – current formattedAddress string
 *   onChange     – called with { formattedAddress, lat, lng, placeId }
 *   placeholder  – input placeholder
 *   error        – error message string
 */
export default function AddressAutocomplete({ value, onChange, placeholder = 'Enter delivery address', error }) {
  const inputRef = useRef(null);
  const autocompleteRef = useRef(null);
  const [inputVal, setInputVal] = useState(value || '');
  const [locating, setLocating] = useState(false);
  const [sdkLoaded, setSdkLoaded] = useState(false);

  // Load the Google Maps JS SDK once
  useEffect(() => {
    if (!GOOGLE_MAPS_KEY) { setSdkLoaded(false); return; }
    if (window.google?.maps?.places) { setSdkLoaded(true); return; }

    const scriptId = 'google-maps-sdk';
    if (document.getElementById(scriptId)) {
      // Already loading — wait
      const check = setInterval(() => {
        if (window.google?.maps?.places) { setSdkLoaded(true); clearInterval(check); }
      }, 200);
      return () => clearInterval(check);
    }

    const script = document.createElement('script');
    script.id = scriptId;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_KEY}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => setSdkLoaded(true);
    document.head.appendChild(script);
  }, []);

  // Attach Autocomplete once SDK is ready
  useEffect(() => {
    if (!sdkLoaded || !inputRef.current) return;
    autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current, {
      types: ['geocode'],
      componentRestrictions: { country: 'in' },
    });
    autocompleteRef.current.addListener('place_changed', () => {
      const place = autocompleteRef.current.getPlace();
      if (!place.geometry) return;
      const payload = {
        formattedAddress: place.formatted_address,
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
        placeId: place.place_id,
      };
      setInputVal(place.formatted_address);
      onChange(payload);
    });
  }, [sdkLoaded, onChange]);

  // "Use my location"
  const handleGeolocate = () => {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        try {
          if (GOOGLE_MAPS_KEY) {
            const res = await fetch(
              `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_MAPS_KEY}`
            );
            const data = await res.json();
            const addr = data.results?.[0];
            const payload = {
              formattedAddress: addr?.formatted_address || `${lat.toFixed(4)}, ${lng.toFixed(4)}`,
              lat,
              lng,
              placeId: addr?.place_id || '',
            };
            setInputVal(payload.formattedAddress);
            onChange(payload);
          } else {
            const fallback = `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
            setInputVal(fallback);
            onChange({ formattedAddress: fallback, lat, lng, placeId: '' });
          }
        } catch {
          const fallback = `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
          setInputVal(fallback);
          onChange({ formattedAddress: fallback, lat, lng, placeId: '' });
        } finally {
          setLocating(false);
        }
      },
      () => setLocating(false)
    );
  };

  // If no Google key — plain text input with geolocation
  const handleManualChange = (e) => {
    const v = e.target.value;
    setInputVal(v);
    onChange({ formattedAddress: v, lat: null, lng: null, placeId: '' });
  };

  return (
    <div className="flex flex-col gap-1.5">
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </span>
        <input
          ref={inputRef}
          type="text"
          value={inputVal}
          onChange={handleManualChange}
          placeholder={placeholder}
          className={`w-full h-11 pl-9 pr-4 rounded-xl border text-sm bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-400/50 transition ${error ? 'border-red-400' : 'border-gray-200 dark:border-gray-700 focus:border-amber-400 dark:focus:border-amber-400'}`}
        />
      </div>

      <button
        type="button"
        onClick={handleGeolocate}
        disabled={locating}
        className="flex items-center gap-1.5 text-amber-600 hover:text-amber-700 text-xs font-semibold w-fit transition-colors disabled:opacity-50"
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0-6v2m0 16v2m8-10h-2M6 12H4m13.66-5.66l-1.42 1.42M7.76 16.24l-1.42 1.42M18.36 16.24l-1.42-1.42M7.76 7.76L6.34 6.34" />
        </svg>
        {locating ? 'Detecting location…' : 'Use my current location'}
      </button>

      {error && <p className="text-red-500 text-xs">{error}</p>}
      {!GOOGLE_MAPS_KEY && (
        <p className="text-gray-400 text-xs">
          💡 Add <code>VITE_GOOGLE_MAPS_API_KEY</code> in <code>.env</code> to enable address autocomplete.
        </p>
      )}
    </div>
  );
}
