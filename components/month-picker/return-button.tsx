"use client";

import { Button } from "../ui/button";

interface ReturnButtonProps {
	disabled?: boolean;
	onClick: () => void;
}

export default function ReturnButton({ disabled, onClick }: ReturnButtonProps) {
	return (
		<Button
			className="w-32 h-6 rounded-sm lowercase"
			size="sm"
			disabled={disabled}
			onClick={onClick}
			aria-label="Retornar para o mês atual"
		>
			Ir para Mês Atual
		</Button>
	);
}
