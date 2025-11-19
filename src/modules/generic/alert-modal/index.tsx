'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';

type Variant = 'success' | 'error';

export default function AlertDialog({
	open,
	onOpenChange,
	variant,
	title,
	description,
	primary = { label: 'Close', onClick: () => onOpenChange(false) },
}: {
	open: boolean;
	onOpenChange: (v: boolean) => void;
	variant: Variant;
	title?: string;
	description?: string;
	primary?: { label: string; onClick: () => void };
}) {
	const bar = variant === 'success' ? 'bg-green-900' : 'bg-red-900';
	const ring = variant === 'success' ? 'ring-green-900/15' : 'ring-red-800/15';
	const router = useRouter();
	return (
		<Dialog.Root open={open} onOpenChange={onOpenChange}>
			<Dialog.Portal>
				<Dialog.Overlay className="fixed inset-0 z-[999] bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0" />
				<Dialog.Content
					className={`fixed h-80 left-1/2 top-1/2 z-[1000] w-[92vw] max-w-md -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-xl bg-white shadow-xl ring-1 ${ring} focus:outline-none`}
				>
					<div className={`h-4 w-full ${bar}`} />
					<div className="p-5">
						<div className="flex flex-col w-full gap-6">
							<div className="flex w-full justify-end">
								<Dialog.Close asChild>
									<button
										aria-label="Close"
										className="rounded p-1 text-gray-700 transition hover:bg-gray-100 hover:text-gray-900"
									>
										<X className="h-5 w-5" />
									</button>
								</Dialog.Close>
							</div>
							<div>
								<Dialog.Title className="flex w-full justify-center text-center text-3xl font-serif font-semibold text-green-900">
									{title ?? (variant === 'success' ? 'Success' : 'Something went wrong')}
								</Dialog.Title>
								{description ? (
									<Dialog.Description className="mt-5 w-full text-center text-sm text-gray-600">
										{description}
									</Dialog.Description>
								) : null}
								{variant !== 'success' && (
									<div className="mt-8 flex w-full justify-center">
										<button
											onClick={() => router.push('/contact')}
											className={`inline-flex items-center justify-center rounded-md px-10 py-2 text-xl font-semibold text-white bg-green-900 hover:bg-green-800 border-green-800 border`}
										>
											{'Contact Us'}
										</button>
									</div>
								)}
							</div>
						</div>

						{/* <div className="mt-5 flex justify-end">
							<button
								onClick={primary.onClick}
								className={`inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-semibold text-white ${
									variant === 'success'
										? 'bg-green-900 hover:bg-green-800'
										: 'bg-red-700 hover:bg-red-800'
								}`}
							>
								{primary.label}
							</button>
						</div> */}
					</div>
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	);
}
