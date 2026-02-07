"use client";

import DotIcon from "@/components/dot-icon";

export function TypeSelectContent({ label }: { label: string }) {
	const isReceita = label === "Receita";

	return (
		<span className="flex items-center gap-2">
			<DotIcon color={isReceita ? "bg-success" : "bg-destructive"} />
			<span>{label}</span>
		</span>
	);
}
