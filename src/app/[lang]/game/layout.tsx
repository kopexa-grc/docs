import type { ReactNode } from "react";

export default function GameLayout({ children }: { children: ReactNode }) {
	return (
		<div className="fixed inset-0 overflow-auto bg-[#0a1929]">
			{children}
		</div>
	);
}
