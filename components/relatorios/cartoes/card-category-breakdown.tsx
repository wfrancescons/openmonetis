"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { CardDetailData } from "@/lib/relatorios/cartoes-report";
import { getIconComponent } from "@/lib/utils/icons";
import { RiPieChartLine } from "@remixicon/react";

type CardCategoryBreakdownProps = {
  data: CardDetailData["categoryBreakdown"];
};

const COLORS = [
  "#ef4444",
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#8b5cf6",
  "#ec4899",
  "#14b8a6",
  "#f97316",
  "#6366f1",
  "#84cc16",
];

export function CardCategoryBreakdown({ data }: CardCategoryBreakdownProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium">
            Gastos por Categoria
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
            <RiPieChartLine className="size-8 mb-2" />
            <p className="text-sm">Nenhum gasto neste período</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">
          Gastos por Categoria
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {data.map((category, index) => {
          const IconComponent = category.icon
            ? getIconComponent(category.icon)
            : null;
          const color = COLORS[index % COLORS.length];

          return (
            <div key={category.id} className="space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {IconComponent ? (
                    <IconComponent
                      className="size-4"
                      style={{ color }}
                    />
                  ) : (
                    <div
                      className="size-4 rounded-sm"
                      style={{ backgroundColor: color }}
                    />
                  )}
                  <span className="text-sm font-medium truncate max-w-[150px]">
                    {category.name}
                  </span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {formatCurrency(category.amount)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${category.percent}%`,
                      backgroundColor: color,
                    }}
                  />
                </div>
                <span className="text-xs text-muted-foreground w-10 text-right">
                  {category.percent.toFixed(0)}%
                </span>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
