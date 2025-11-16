"use client";

import MoneyValues from "@/components/money-values";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { RiPieChartLine } from "@remixicon/react";

type AnalysisSummaryPanelProps = {
  totalInstallments: number;
  totalInvoices: number;
  grandTotal: number;
  selectedCount: number;
};

export function AnalysisSummaryPanel({
  totalInstallments,
  totalInvoices,
  grandTotal,
  selectedCount,
}: AnalysisSummaryPanelProps) {
  const hasInstallments = totalInstallments > 0;
  const hasInvoices = totalInvoices > 0;

  return (
    <Card className="border-primary/20">
      <CardHeader className="border-b">
        <div className="flex items-center gap-2">
          <RiPieChartLine className="size-4 text-primary" />
          <CardTitle className="text-base">Resumo</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 pt-6">
        {/* Total geral */}
        <div className="flex flex-col items-center gap-2 rounded-lg bg-primary/10 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Total Selecionado
          </p>
          <MoneyValues
            amount={grandTotal}
            className="text-2xl font-bold text-primary"
          />
          <p className="text-xs text-muted-foreground">
            {selectedCount} {selectedCount === 1 ? "item" : "itens"}
          </p>
        </div>

        <Separator />

        {/* Breakdown */}
        <div className="flex flex-col gap-3">
          <p className="text-sm font-medium">Detalhamento</p>

          {/* Parcelas */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="size-2 rounded-full bg-blue-500" />
              <span className="text-sm text-muted-foreground">Parcelas</span>
            </div>
            <MoneyValues amount={totalInstallments} className="text-sm" />
          </div>

          {/* Faturas */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="size-2 rounded-full bg-purple-500" />
              <span className="text-sm text-muted-foreground">Faturas</span>
            </div>
            <MoneyValues amount={totalInvoices} className="text-sm" />
          </div>
        </div>

        <Separator />

        {/* Percentuais */}
        {grandTotal > 0 && (
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium">Distribuição</p>

            {hasInstallments && (
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Parcelas</span>
                <span className="font-medium">
                  {((totalInstallments / grandTotal) * 100).toFixed(1)}%
                </span>
              </div>
            )}

            {hasInvoices && (
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Faturas</span>
                <span className="font-medium">
                  {((totalInvoices / grandTotal) * 100).toFixed(1)}%
                </span>
              </div>
            )}
          </div>
        )}

        {/* Mensagem quando nada está selecionado */}
        {selectedCount === 0 && (
          <div className="rounded-lg bg-muted/50 p-3 text-center">
            <p className="text-xs text-muted-foreground">
              Selecione parcelas ou faturas para ver o resumo
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
