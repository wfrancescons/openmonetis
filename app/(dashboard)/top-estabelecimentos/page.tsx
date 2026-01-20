import { EstablishmentsList } from "@/components/top-estabelecimentos/establishments-list";
import { HighlightsCards } from "@/components/top-estabelecimentos/highlights-cards";
import { PeriodFilterButtons } from "@/components/top-estabelecimentos/period-filter";
import { SummaryCards } from "@/components/top-estabelecimentos/summary-cards";
import { TopCategories } from "@/components/top-estabelecimentos/top-categories";
import { getUser } from "@/lib/auth/server";
import {
  fetchTopEstabelecimentosData,
  type PeriodFilter,
} from "@/lib/top-estabelecimentos/fetch-data";
import { parsePeriodParam } from "@/lib/utils/period";

type PageSearchParams = Promise<Record<string, string | string[] | undefined>>;

type PageProps = {
  searchParams?: PageSearchParams;
};

const getSingleParam = (
  params: Record<string, string | string[] | undefined> | undefined,
  key: string,
) => {
  const value = params?.[key];
  if (!value) return null;
  return Array.isArray(value) ? (value[0] ?? null) : value;
};

const validatePeriodFilter = (value: string | null): PeriodFilter => {
  if (value === "3" || value === "6" || value === "12") {
    return value;
  }
  return "6";
};

export default async function TopEstabelecimentosPage({
  searchParams,
}: PageProps) {
  const user = await getUser();
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const periodoParam = getSingleParam(resolvedSearchParams, "periodo");
  const mesesParam = getSingleParam(resolvedSearchParams, "meses");

  const { period: currentPeriod } = parsePeriodParam(periodoParam);
  const periodFilter = validatePeriodFilter(mesesParam);

  const data = await fetchTopEstabelecimentosData(
    user.id,
    currentPeriod,
    periodFilter,
  );

  return (
    <main className="@container/main flex flex-col gap-4 px-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight">
            Top Estabelecimentos
          </h1>
          <p className="text-sm text-muted-foreground">
            Análise dos locais onde você mais compra • {data.periodLabel}
          </p>
        </div>
        <PeriodFilterButtons currentFilter={periodFilter} />
      </div>

      <SummaryCards summary={data.summary} />

      <HighlightsCards summary={data.summary} />

      <div className="grid gap-4 @3xl/main:grid-cols-3">
        <div className="@3xl/main:col-span-2">
          <EstablishmentsList establishments={data.establishments} />
        </div>
        <div>
          <TopCategories categories={data.topCategories} />
        </div>
      </div>
    </main>
  );
}
