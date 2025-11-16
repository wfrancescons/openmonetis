"use client";

import MoneyValues from "@/components/money-values";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useMemo, useState } from "react";
import type { InstallmentAnalysisData } from "./types";
import { InstallmentGroupCard } from "./installment-group-card";
import { PendingInvoiceCard } from "./pending-invoice-card";
import { AnalysisSummaryPanel } from "./analysis-summary-panel";
import {
  RiCalculatorLine,
  RiCheckboxBlankLine,
  RiCheckboxLine,
} from "@remixicon/react";

type InstallmentAnalysisPageProps = {
  data: InstallmentAnalysisData;
};

export function InstallmentAnalysisPage({
  data,
}: InstallmentAnalysisPageProps) {
  // Estado para parcelas selecionadas: Map<seriesId, Set<installmentId>>
  const [selectedInstallments, setSelectedInstallments] = useState<
    Map<string, Set<string>>
  >(new Map());

  // Estado para faturas selecionadas: Set<invoiceKey (cartaoId:period)>
  const [selectedInvoices, setSelectedInvoices] = useState<Set<string>>(
    new Set()
  );

  // Calcular se está tudo selecionado
  const isAllSelected = useMemo(() => {
    const allInstallmentsSelected = data.installmentGroups.every((group) => {
      const groupSelection = selectedInstallments.get(group.seriesId);
      if (!groupSelection) return false;
      return (
        groupSelection.size === group.pendingInstallments.length &&
        group.pendingInstallments.length > 0
      );
    });

    const allInvoicesSelected =
      data.pendingInvoices.length === selectedInvoices.size;

    return (
      allInstallmentsSelected &&
      allInvoicesSelected &&
      (data.installmentGroups.length > 0 || data.pendingInvoices.length > 0)
    );
  }, [selectedInstallments, selectedInvoices, data]);

  // Função para selecionar/desselecionar tudo
  const toggleSelectAll = () => {
    if (isAllSelected) {
      // Desmarcar tudo
      setSelectedInstallments(new Map());
      setSelectedInvoices(new Set());
    } else {
      // Marcar tudo
      const newInstallments = new Map<string, Set<string>>();
      data.installmentGroups.forEach((group) => {
        const ids = new Set(group.pendingInstallments.map((i) => i.id));
        newInstallments.set(group.seriesId, ids);
      });

      const newInvoices = new Set(
        data.pendingInvoices.map((inv) => `${inv.cartaoId}:${inv.period}`)
      );

      setSelectedInstallments(newInstallments);
      setSelectedInvoices(newInvoices);
    }
  };

  // Função para selecionar/desselecionar um grupo de parcelas
  const toggleGroupSelection = (seriesId: string, installmentIds: string[]) => {
    const newMap = new Map(selectedInstallments);
    const current = newMap.get(seriesId) || new Set<string>();

    if (current.size === installmentIds.length) {
      // Já está tudo selecionado, desmarcar
      newMap.delete(seriesId);
    } else {
      // Marcar tudo
      newMap.set(seriesId, new Set(installmentIds));
    }

    setSelectedInstallments(newMap);
  };

  // Função para selecionar/desselecionar parcela individual
  const toggleInstallmentSelection = (seriesId: string, installmentId: string) => {
    const newMap = new Map(selectedInstallments);
    const current = newMap.get(seriesId) || new Set<string>();

    if (current.has(installmentId)) {
      current.delete(installmentId);
      if (current.size === 0) {
        newMap.delete(seriesId);
      } else {
        newMap.set(seriesId, current);
      }
    } else {
      current.add(installmentId);
      newMap.set(seriesId, current);
    }

    setSelectedInstallments(newMap);
  };

  // Função para selecionar/desselecionar fatura
  const toggleInvoiceSelection = (invoiceKey: string) => {
    const newSet = new Set(selectedInvoices);
    if (newSet.has(invoiceKey)) {
      newSet.delete(invoiceKey);
    } else {
      newSet.add(invoiceKey);
    }
    setSelectedInvoices(newSet);
  };

  // Calcular totais
  const { totalInstallments, totalInvoices, grandTotal, selectedCount } =
    useMemo(() => {
      let installmentsSum = 0;
      let installmentsCount = 0;

      selectedInstallments.forEach((installmentIds, seriesId) => {
        const group = data.installmentGroups.find(
          (g) => g.seriesId === seriesId
        );
        if (group) {
          installmentIds.forEach((id) => {
            const installment = group.pendingInstallments.find(
              (i) => i.id === id
            );
            if (installment) {
              installmentsSum += installment.amount;
              installmentsCount++;
            }
          });
        }
      });

      let invoicesSum = 0;
      let invoicesCount = 0;

      selectedInvoices.forEach((key) => {
        const [cartaoId, period] = key.split(":");
        const invoice = data.pendingInvoices.find(
          (inv) => inv.cartaoId === cartaoId && inv.period === period
        );
        if (invoice) {
          invoicesSum += invoice.totalAmount;
          invoicesCount++;
        }
      });

      return {
        totalInstallments: installmentsSum,
        totalInvoices: invoicesSum,
        grandTotal: installmentsSum + invoicesSum,
        selectedCount: installmentsCount + invoicesCount,
      };
    }, [selectedInstallments, selectedInvoices, data]);

  const hasNoData =
    data.installmentGroups.length === 0 && data.pendingInvoices.length === 0;

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
          <RiCalculatorLine className="size-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Análise de Parcelas e Faturas</h1>
          <p className="text-sm text-muted-foreground">
            Veja quanto você gastaria pagando tudo que está em aberto
          </p>
        </div>
      </div>

      {/* Card de resumo principal */}
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
        <CardContent className="flex flex-col items-center justify-center gap-3 py-8">
          <p className="text-sm font-medium text-muted-foreground">
            Se você pagar tudo que está selecionado:
          </p>
          <MoneyValues
            amount={grandTotal}
            className="text-4xl font-bold text-primary"
          />
          <p className="text-sm text-muted-foreground">
            {selectedCount} {selectedCount === 1 ? "item" : "itens"} selecionados
          </p>
        </CardContent>
      </Card>

      {/* Botões de ação */}
      {!hasNoData && (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleSelectAll}
            className="gap-2"
          >
            {isAllSelected ? (
              <RiCheckboxLine className="size-4" />
            ) : (
              <RiCheckboxBlankLine className="size-4" />
            )}
            {isAllSelected ? "Desmarcar Tudo" : "Selecionar Tudo"}
          </Button>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Conteúdo principal */}
        <div className="flex flex-col gap-6">
          {/* Seção de Lançamentos Parcelados */}
          {data.installmentGroups.length > 0 && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <Separator className="flex-1" />
                <h2 className="text-lg font-semibold">Lançamentos Parcelados</h2>
                <Separator className="flex-1" />
              </div>

              <div className="flex flex-col gap-3">
                {data.installmentGroups.map((group) => (
                  <InstallmentGroupCard
                    key={group.seriesId}
                    group={group}
                    selectedInstallments={
                      selectedInstallments.get(group.seriesId) || new Set()
                    }
                    onToggleGroup={() =>
                      toggleGroupSelection(
                        group.seriesId,
                        group.pendingInstallments.map((i) => i.id)
                      )
                    }
                    onToggleInstallment={(installmentId) =>
                      toggleInstallmentSelection(group.seriesId, installmentId)
                    }
                  />
                ))}
              </div>
            </div>
          )}

          {/* Seção de Faturas Pendentes */}
          {data.pendingInvoices.length > 0 && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <Separator className="flex-1" />
                <h2 className="text-lg font-semibold">Faturas Pendentes</h2>
                <Separator className="flex-1" />
              </div>

              <div className="flex flex-col gap-3">
                {data.pendingInvoices.map((invoice) => {
                  const invoiceKey = `${invoice.cartaoId}:${invoice.period}`;
                  return (
                    <PendingInvoiceCard
                      key={invoiceKey}
                      invoice={invoice}
                      isSelected={selectedInvoices.has(invoiceKey)}
                      onToggle={() => toggleInvoiceSelection(invoiceKey)}
                    />
                  );
                })}
              </div>
            </div>
          )}

          {/* Estado vazio */}
          {hasNoData && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center gap-3 py-12">
                <RiCalculatorLine className="size-12 text-muted-foreground/50" />
                <div className="text-center">
                  <p className="font-medium">Nenhuma parcela ou fatura pendente</p>
                  <p className="text-sm text-muted-foreground">
                    Você está em dia com seus pagamentos!
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Painel lateral de resumo (sticky) */}
        {!hasNoData && (
          <div className="lg:sticky lg:top-4 lg:self-start">
            <AnalysisSummaryPanel
              totalInstallments={totalInstallments}
              totalInvoices={totalInvoices}
              grandTotal={grandTotal}
              selectedCount={selectedCount}
            />
          </div>
        )}
      </div>
    </div>
  );
}
