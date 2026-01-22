'use client';

import { importLibrary, setOptions } from '@googlemaps/js-api-loader';
import { useEffect, useRef } from 'react';

type Props = {
	center: google.maps.LatLngLiteral;
	zoom?: number;
	className?: string;
	markerTitle?: string;
	perimeter?: google.maps.LatLngLiteral[];
	markers?: {
		position: google.maps.LatLngLiteral;
		title: string;
		description?: string;
		imageSrc?: string;
	}[];
};

export default function MapCard({
	center,
	zoom = 17,
	className = '',
	markerTitle = 'Location',
	perimeter,
	markers,
}: Props) {
	const mapRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		let map: google.maps.Map | null = null;
		let ro: ResizeObserver | null = null;
		const markerInstances: (google.maps.marker.AdvancedMarkerElement | google.maps.Marker)[] = [];
		let polygon: google.maps.Polygon | null = null;
		let cancelled = false;

		(async () => {
			const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
			if (!apiKey || !mapRef.current) return;

			// modern loader config
			setOptions({ key: apiKey, v: 'weekly' });

			// Always load core maps; advanced markers only if a Map ID is present
			const { Map } = (await importLibrary('maps')) as google.maps.MapsLibrary;
			let AdvancedMarkerElement: google.maps.marker.AdvancedMarkerElementConstructor | null = null;
			const mapId = process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID;
			if (mapId) {
				try {
					const markerLib = (await importLibrary('marker')) as google.maps.MarkerLibrary;
					AdvancedMarkerElement = markerLib.AdvancedMarkerElement;
				} catch (err) {
					console.warn('Advanced marker library failed, falling back to legacy markers', err);
				}
			}

			if (cancelled) return;

			map = new Map(mapRef.current, {
				center,
				zoom,
				mapTypeId: 'satellite',
				disableDefaultUI: true,
				gestureHandling: 'cooperative', // let page scroll; pinch/ctrl+scroll to zoom
				zoomControl: true, // show zoom buttons so users can still zoom
				tilt: 0,
				...(mapId ? { mapId } : {}),
			});

			const spots =
				markers && markers.length > 0
					? markers
					: [{ position: center, title: markerTitle, description: undefined, imageSrc: undefined }];

			const infoWindow = new google.maps.InfoWindow();

			const resetView = () => {
				if (!map) return;
				map.panTo(center);
				map.setZoom(zoom);
				map.setTilt?.(0);
				map.setHeading?.(0);
			};

			if (perimeter && perimeter.length > 2) {
				polygon = new google.maps.Polygon({
					paths: perimeter,
					strokeColor: '#FACC15',
					strokeOpacity: 0.9,
					strokeWeight: 2,
					fillColor: '#FACC15',
					fillOpacity: 0.12,
				});
				polygon.setMap(map);
			}

			spots.forEach((spot) => {
				const mk =
					AdvancedMarkerElement && mapId
						? new AdvancedMarkerElement({ map, position: spot.position, title: spot.title })
						: // eslint-disable-next-line @typescript-eslint/ban-ts-comment
							// @ts-ignore legacy marker fallback (no mapId required)
							new google.maps.Marker({ map, position: spot.position, title: spot.title });

				mk.addListener('click', () => {
					const container = document.createElement('div');
					container.style.maxWidth = '240px';
					container.style.fontFamily = 'sans-serif';
					container.innerHTML = `
						<div style="display:flex;gap:12px;align-items:flex-start;">
							${spot.imageSrc ? `<img src="${spot.imageSrc}" alt="${spot.title}" style="width:64px;height:64px;object-fit:cover;border-radius:8px;flex-shrink:0;" />` : ''}
							<div style="flex:1;">
								<h3 style="margin:0 0 6px;font-size:14px;font-weight:700;">${spot.title}</h3>
								${spot.description ? `<p style="margin:0;font-size:12px;line-height:1.4;">${spot.description}</p>` : ''}
							</div>
						</div>
					`;
					infoWindow.setContent(container);
					infoWindow.open({ anchor: mk, map });

					map?.panTo(spot.position);
					map?.setZoom(Math.min(zoom + 4, 21));
					map?.setTilt?.(80);
					map?.setHeading?.(25);
				});

				markerInstances.push(mk);
			});

			infoWindow.addListener('closeclick', resetView);

			// keep center on container resize
			ro = new ResizeObserver(() => map?.setCenter(center));
			ro.observe(mapRef.current);
		})();

		return () => {
			cancelled = true;
			ro?.disconnect();
			markerInstances.forEach((mk) => {
				// AdvancedMarkerElement detaches when map=null
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore
				mk.map = null;
				google.maps.event.clearInstanceListeners(mk);
			});
			polygon?.setMap(null);
			if (map) {
				google.maps.event.clearInstanceListeners(map);
			}
			map = null;
		};
	}, [center, zoom, markerTitle, markers, perimeter]);

	return (
		<div
			ref={mapRef}
			className={`w-full rounded-xl border border-green-900/20 ${className}`}
			style={{ height: '550px' }}
		/>
	);
}
