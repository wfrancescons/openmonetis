import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
	return (
		<main className="flex flex-col gap-4 px-6">
			<div className="flex flex-col gap-1">
				<Skeleton className="h-8 w-48" />
				<Skeleton className="h-4 w-96" />
			</div>

			<Skeleton className="h-10 w-full max-w-md" />

			<div className="grid gap-4 lg:grid-cols-3">
				<div className="lg:col-span-1">
					<Card>
						<CardHeader className="pb-2">
							<Skeleton className="h-5 w-40" />
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="grid gap-3 sm:grid-cols-3">
								<Skeleton className="h-16 w-full" />
								<Skeleton className="h-16 w-full" />
								<Skeleton className="h-16 w-full" />
							</div>
							<div className="space-y-3">
								{[1, 2, 3].map((i) => (
									<Skeleton key={i} className="h-20 w-full" />
								))}
							</div>
						</CardContent>
					</Card>
				</div>

				<div className="lg:col-span-2 space-y-4">
					<Skeleton className="h-8 w-48" />

					<Card>
						<CardHeader className="pb-2">
							<Skeleton className="h-5 w-40" />
						</CardHeader>
						<CardContent>
							<Skeleton className="h-[280px] w-full" />
						</CardContent>
					</Card>

					<div className="grid gap-4 md:grid-cols-2">
						<Card>
							<CardHeader className="pb-2">
								<Skeleton className="h-5 w-40" />
							</CardHeader>
							<CardContent className="space-y-3">
								{[1, 2, 3, 4, 5].map((i) => (
									<Skeleton key={i} className="h-12 w-full" />
								))}
							</CardContent>
						</Card>

						<Card>
							<CardHeader className="pb-2">
								<Skeleton className="h-5 w-40" />
							</CardHeader>
							<CardContent className="space-y-3">
								{[1, 2, 3, 4, 5].map((i) => (
									<Skeleton key={i} className="h-12 w-full" />
								))}
							</CardContent>
						</Card>
					</div>

					<Card>
						<CardHeader className="pb-2">
							<Skeleton className="h-5 w-40" />
						</CardHeader>
						<CardContent className="space-y-2">
							{[1, 2, 3, 4, 5, 6].map((i) => (
								<Skeleton key={i} className="h-10 w-full" />
							))}
						</CardContent>
					</Card>
				</div>
			</div>
		</main>
	);
}
