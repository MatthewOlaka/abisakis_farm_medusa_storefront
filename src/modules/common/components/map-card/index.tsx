'use client';

import { importLibrary, setOptions } from '@googlemaps/js-api-loader';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

type Spot = {
	position: google.maps.LatLngLiteral;
	title: string;
	description?: string;
	imageSrc?: string;
};

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
	const mapInstanceRef = useRef<google.maps.Map | null>(null);
	const resetViewRef = useRef<() => void>(() => {});
	const [activeSpot, setActiveSpot] = useState<Spot | null>(null);

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
			let AdvancedMarkerElement: typeof google.maps.marker.AdvancedMarkerElement | null = null;
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
			mapInstanceRef.current = map;

			const spots =
				markers && markers.length > 0
					? markers
					: [{ position: center, title: markerTitle, description: undefined, imageSrc: undefined }];

			const resetView = () => {
				if (!map) return;
				map.panTo(center);
				map.setZoom(zoom);
				map.setTilt?.(0);
				map.setHeading?.(0);
			};
			resetViewRef.current = resetView;

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
					setActiveSpot(spot);

					map?.panTo(spot.position);
					map?.setZoom(Math.min(zoom + 4, 21));
					map?.setTilt?.(80);
					map?.setHeading?.(25);
					if (map) {
						google.maps.event.addListenerOnce(map, 'idle', () => {
							map?.setTilt?.(80);
							map?.setHeading?.(25);
						});
					}
				});

				markerInstances.push(mk);
			});

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
			mapInstanceRef.current = null;
			resetViewRef.current = () => {};
			map = null;
		};
	}, [center, zoom, markerTitle, markers, perimeter]);

	return (
		<div className="map-card-root relative">
			<div
				ref={mapRef}
				className={`w-full rounded-xl border border-green-900/20 ${className}`}
				style={{ height: '550px' }}
			/>
			{activeSpot ? (
				<div className="absolute right-4 top-4 z-10 w-[300px] min-h-[180px] rounded-xl bg-yellow-100 p-4 shadow-xl">
					<button
						type="button"
						className="absolute right-2 top-2 rounded px-2 py-1 text-sm font-semibold text-gray-500 hover:bg-gray-100 hover:text-gray-700"
						onClick={() => {
							setActiveSpot(null);
							resetViewRef.current();
							const currentMap = mapInstanceRef.current;
							if (currentMap) {
								google.maps.event.addListenerOnce(currentMap, 'idle', () => {
									currentMap.setTilt?.(0);
									currentMap.setHeading?.(0);
								});
							}
						}}
						aria-label="Close map details"
					>
						×
					</button>
					<div className="flex min-h-[180px] gap-3 pr-5">
						{activeSpot.imageSrc ? (
							<Image
								src={activeSpot.imageSrc}
								alt={activeSpot.title}
								width={96}
								height={156}
								unoptimized
								className="h-[156px] w-24 shrink-0 rounded-lg object-cover"
							/>
						) : null}
						<div className="flex-1">
							<h3 className="mb-2 font-serif text-lg xs:text-xl font-bold text-green-900">
								{activeSpot.title}
							</h3>
							{activeSpot.description ? (
								<p className="text-sm leading-6 text-gray-700">{activeSpot.description}</p>
							) : null}
						</div>
					</div>
				</div>
			) : null}
		</div>
	);
}
