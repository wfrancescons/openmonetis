"use client";

import { RiFireLine, RiTrophyLine } from "@remixicon/react";
import { Card, CardContent } from "@/components/ui/card";
import type { TopEstabelecimentosData } from "@/lib/top-estabelecimentos/fetch-data";

type HighlightsCardsProps = {
	summary: TopEstabelecimentosData["summary"];
};

export function HighlightsCards({ summary }: HighlightsCardsProps) {
	return (
		<div className="grid gap-3 sm:grid-cols-2">
			<Card className="bg-linear-to-br from-amber-50 to-orange-50/50 dark:from-amber-950/20 dark:to-orange-950/10 border-amber-200/50 dark:border-amber-800/30">
				<CardContent className="p-4">
					<div className="flex items-center gap-3">
						<div className="flex items-center justify-center size-10 rounded-xl bg-amber-100 dark:bg-amber-900/40 shadow-sm">
							<RiTrophyLine className="size-5 text-amber-600 dark:text-amber-400" />
						</div>
						<div className="min-w-0 flex-1">
							<p className="text-xs text-amber-700/80 dark:text-amber-400/80 font-medium">
								Mais Frequente
							</p>
							<p className="font-semibold text-amber-900 dark:text-amber-100 truncate">
								{summary.mostFrequent || "—"}
							</p>
						</div>
					</div>
				</CardContent>
			</Card>

			<Card className="bg-linear-to-br from-red-50 to-rose-50/50 dark:from-red-950/20 dark:to-rose-950/10 border-red-200/50 dark:border-red-800/30">
				<CardContent className="p-4">
					<div className="flex items-center gap-3">
						<div className="flex items-center justify-center size-10 rounded-xl bg-red-100 dark:bg-red-900/40 shadow-sm">
							<RiFireLine className="size-5 text-red-600 dark:text-red-400" />
						</div>
						<div className="min-w-0 flex-1">
							<p className="text-xs text-red-700/80 dark:text-red-400/80 font-medium">
								Maior Gasto Total
							</p>
							<p className="font-semibold text-red-900 dark:text-red-100 truncate">
								{summary.highestSpending || "—"}
							</p>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
