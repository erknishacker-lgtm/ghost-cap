"use client";

import { Button, Logo } from "@cap/ui";
import { classNames } from "@cap/utils";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { type ReactNode, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";

interface MobileMenuProps {
	stars?: string;
}

interface NavLink {
	href: string;
	text: string;
	external?: boolean;
	icon?: ReactNode;
}

const primaryLinks: NavLink[] = [
	{ href: "/pricing", text: "Pricing" },
	{ href: "/download", text: "Download" },
	{ href: "/blog", text: "Blog" },
	{ href: "/changelog", text: "Changelog" },
	{ href: "/about", text: "About" },
	{ href: "/testimonials", text: "Testimonials" },
	{ href: "/faq", text: "FAQs" },
];

const secondaryLinks: NavLink[] = [
	{
		href: "https://discord.gg/y8gdQ3WRN3",
		text: "Join the community",
		external: true,
		icon: (
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="currentColor"
				className="size-5"
				viewBox="0 0 24 24"
				aria-hidden="true"
			>
				<path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
			</svg>
		),
	},
];

const MobileMenu = ({ stars }: MobileMenuProps) => {
	const pathname = usePathname();
	const menuId = useId();
	const [open, setOpen] = useState(false);
	const [visible, setVisible] = useState(false);
	const [active, setActive] = useState(false);
	const [mounted, setMounted] = useState(false);
	const triggerRef = useRef<HTMLButtonElement>(null);
	const closeRef = useRef<HTMLButtonElement>(null);
	const previousPathname = useRef(pathname);

	useEffect(() => {
		setMounted(true);
	}, []);

	useEffect(() => {
		if (open) {
			setVisible(true);
			const frame = requestAnimationFrame(() => setActive(true));
			return () => cancelAnimationFrame(frame);
		}

		setActive(false);
		const timeout = setTimeout(() => setVisible(false), 300);
		return () => clearTimeout(timeout);
	}, [open]);

	useEffect(() => {
		if (previousPathname.current !== pathname) {
			previousPathname.current = pathname;
			setOpen(false);
		}
	}, [pathname]);

	useEffect(() => {
		const query = window.matchMedia("(min-width: 1024px)");
		const onChange = (event: MediaQueryListEvent) => {
			if (event.matches) {
				setOpen(false);
			}
		};

		query.addEventListener("change", onChange);
		return () => query.removeEventListener("change", onChange);
	}, []);

	useEffect(() => {
		if (!open) {
			return;
		}

		const html = document.documentElement;
		const { body } = document;
		const scrollbarWidth = window.innerWidth - html.clientWidth;
		const previousOverflow = html.style.overflow;
		const previousPaddingRight = body.style.paddingRight;

		html.style.overflow = "hidden";
		if (scrollbarWidth > 0) {
			body.style.paddingRight = `${scrollbarWidth}px`;
		}

		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				setOpen(false);
			}
		};

		window.addEventListener("keydown", onKeyDown);

		return () => {
			html.style.overflow = previousOverflow;
			body.style.paddingRight = previousPaddingRight;
			window.removeEventListener("keydown", onKeyDown);
		};
	}, [open]);

	useEffect(() => {
		if (active) {
			closeRef.current?.focus();
		}
	}, [active]);

	const wasVisible = useRef(false);
	useEffect(() => {
		if (wasVisible.current && !visible) {
			triggerRef.current?.focus();
		}
		wasVisible.current = visible;
	}, [visible]);

	return (
		<>
			<button
				ref={triggerRef}
				type="button"
				aria-label="Open menu"
				aria-haspopup="dialog"
				aria-expanded={open}
				aria-controls={menuId}
				onClick={() => setOpen(true)}
				className="inline-flex justify-center items-center -mr-1 rounded-full transition-colors size-10 text-gray-12 hover:bg-gray-3 active:scale-95"
			>
				<Menu className="size-6" strokeWidth={2} aria-hidden="true" />
			</button>

			{mounted && visible
				? createPortal(
						<div
							id={menuId}
							role="dialog"
							aria-modal="true"
							aria-label="Site navigation"
							className="fixed inset-0 z-[100] lg:hidden"
						>
							<button
								type="button"
								aria-label="Close menu"
								tabIndex={-1}
								onClick={() => setOpen(false)}
								className={classNames(
									"absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ease-out motion-reduce:transition-none",
									active ? "opacity-100" : "opacity-0",
								)}
							/>

							<div
								className={classNames(
									"flex overflow-hidden absolute inset-x-0 top-0 flex-col h-[100dvh] bg-gray-1 transition-opacity duration-300 ease-out motion-reduce:transition-none",
									active ? "opacity-100" : "opacity-0",
								)}
							>
								<div className="flex shrink-0 justify-between items-center px-5 h-[72px] pt-[env(safe-area-inset-top)]">
									<Link
										href="/home"
										aria-label="Cap home"
										onClick={() => setOpen(false)}
									>
										<Logo
											viewBoxDimensions="0 0 120 40"
											style={{ width: 84, height: 36 }}
										/>
									</Link>
									<button
										ref={closeRef}
										type="button"
										aria-label="Close menu"
										onClick={() => setOpen(false)}
										className="inline-flex justify-center items-center rounded-full border transition-colors size-10 border-gray-4 text-gray-12 hover:bg-gray-3 active:scale-95"
									>
										<X className="size-5" strokeWidth={2} aria-hidden="true" />
									</button>
								</div>

								<div className="overflow-y-auto flex-1 px-5 pt-2 pb-6 overscroll-contain">
									<nav aria-label="Primary">
										<ul className="space-y-1 list-none">
											{primaryLinks.map((link, index) => (
												<li
													key={link.href}
													className={classNames(
														"transition-opacity duration-300 ease-out motion-reduce:transition-none",
														active ? "opacity-100" : "opacity-0",
													)}
													style={{
														transitionDelay: active
															? `${250 + index * 45}ms`
															: "0ms",
													}}
												>
													<Link
														href={link.href}
														onClick={() => setOpen(false)}
														className="flex items-center px-4 -mx-4 h-12 text-xl font-medium rounded-xl transition-colors text-gray-12 hover:bg-gray-3"
													>
														{link.text}
													</Link>
												</li>
											))}
										</ul>
									</nav>

									<div className="my-5 h-px bg-gray-4" />

									<ul className="space-y-1 list-none">
										{secondaryLinks.map((link, index) => (
											<li
												key={link.href}
												className={classNames(
													"transition-opacity duration-300 ease-out motion-reduce:transition-none",
													active ? "opacity-100" : "opacity-0",
												)}
												style={{
													transitionDelay: active
														? `${250 + (primaryLinks.length + index) * 45}ms`
														: "0ms",
												}}
											>
												<Link
													href={link.href}
													target="_blank"
													rel="noopener noreferrer"
													className="flex gap-3 items-center px-4 -mx-4 h-11 rounded-xl transition-colors text-gray-11 hover:bg-gray-3 hover:text-gray-12"
												>
													{link.icon}
													<span className="text-base font-medium">
														{link.text}
													</span>
												</Link>
											</li>
										))}
									</ul>
								</div>

								<div className="shrink-0 px-5 pt-4 pb-[calc(env(safe-area-inset-bottom)+24px)] space-y-3 border-t border-gray-4 bg-gray-1">
									<Button
										variant="dark"
										href="/signup"
										size="lg"
										className="w-full font-medium"
										onClick={() => setOpen(false)}
									>
										Sign up
									</Button>
									<Button
										variant="gray"
										href="/login"
										size="lg"
										className="w-full font-medium"
										onClick={() => setOpen(false)}
									>
										Login
									</Button>
								</div>
							</div>
						</div>,
						document.body,
					)
				: null}
		</>
	);
};

export default MobileMenu;
