// src/modules/common/components/MountReveal.tsx
'use client';
import { useEffect, useState } from 'react';
export default function MountReveal({ children }: { children: React.ReactNode }) {
	const [show, setShow] = useState(false);
	useEffect(() => {
		const id = requestAnimationFrame(() => setShow(true));
		return () => cancelAnimationFrame(id);
	}, []);
	return show ? <>{children}</> : null;
}
