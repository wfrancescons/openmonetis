"use client";

import MoneyValues from "@/components/money-values";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils/ui";
import { RiArrowDownSLine, RiArrowRightSLine } from "@remixicon/react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useState } from "react";
import type { InstallmentGroup } from "./types";

type InstallmentGroupCardProps = {
  group: InstallmentGroup;
  selectedInstallments: Set<string>;
  onToggleGroup: () => void;
  onToggleInstallment: (installmentId: string) => void;
};

export function InstallmentGroupCard({
  group,
  selectedInstallments,
  onToggleGroup,
  onToggleInstallment,
}: InstallmentGroupCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const isFullySelected =
    selectedInstallments.size === group.pendingInstallments.length &&
    group.pendingInstallments.length > 0;

  const isPartiallySelected =
    selectedInstallments.size > 0 &&
    selectedInstallments.size < group.pendingInstallments.length;

  const progress =
    group.totalInstallments > 0
      ? ((group.paidInstallments + selectedInstallments.size) /
          group.totalInstallments) *
        100
      : 0;

  const selectedAmount = group.pendingInstallments
    .filter((i) => selectedInstallments.has(i.id))
    .reduce((sum, i) => sum + i.amount, 0);

  return (
    <Card className={cn(isFullySelected && "border-primary/50")}>
      <CardContent className="flex flex-col gap-3 py-4">
        {/* Header do card */}
        <div className="flex items-start gap-3">
          <Checkbox
            checked={isFullySelected}
            onCheckedChange={onToggleGroup}
            className="mt-1"
            aria-label={`Selecionar todas as parcelas de ${group.name}`}
          />

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p className="font-medium">{group.name}</p>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  {group.cartaoName && (
                    <>
                      <span>{group.cartaoName}</span>
                      <span>•</span>
                    </>
                  )}
                  <span>{group.paymentMethod}</span>
                </div>
              </div>

              <div className="flex shrink-0 flex-col items-end gap-1">
                <MoneyValues
                  amount={group.totalPendingAmount}
                  className="text-sm font-semibold"
                />
                {selectedInstallments.size > 0 && (
                  <MoneyValues
                    amount={selectedAmount}
                    className="text-xs text-primary"
                  />
                )}
              </div>
            </div>

            {/* Progress bar */}
            <div className="mt-3">
              <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
                <span>
                  {group.paidInstallments} de {group.totalInstallments} pagas
                </span>
                <span>
                  {group.pendingInstallments.length}{" "}
                  {group.pendingInstallments.length === 1
                    ? "pendente"
                    : "pendentes"}
                </span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            {/* Badges de status */}
            <div className="mt-2 flex flex-wrap gap-2">
              {isPartiallySelected && (
                <Badge variant="secondary" className="text-xs">
                  {selectedInstallments.size} de{" "}
                  {group.pendingInstallments.length} selecionadas
                </Badge>
              )}
            </div>

            {/* Botão de expandir */}
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="mt-3 flex items-center gap-1 text-xs font-medium text-primary hover:underline"
            >
              {isExpanded ? (
                <>
                  <RiArrowDownSLine className="size-4" />
                  Ocultar parcelas ({group.pendingInstallments.length})
                </>
              ) : (
                <>
                  <RiArrowRightSLine className="size-4" />
                  Ver parcelas ({group.pendingInstallments.length})
                </>
              )}
            </button>
          </div>
        </div>

        {/* Lista de parcelas expandida */}
        {isExpanded && (
          <div className="ml-9 mt-2 flex flex-col gap-2 border-l-2 border-muted pl-4">
            {group.pendingInstallments.map((installment) => {
              const isSelected = selectedInstallments.has(installment.id);
              const dueDate = installment.dueDate
                ? format(installment.dueDate, "dd/MM/yyyy", { locale: ptBR })
                : format(installment.purchaseDate, "dd/MM/yyyy", {
                    locale: ptBR,
                  });

              return (
                <div
                  key={installment.id}
                  className={cn(
                    "flex items-center gap-3 rounded-md border p-2 transition-colors",
                    isSelected && "border-primary/50 bg-primary/5"
                  )}
                >
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={() => onToggleInstallment(installment.id)}
                    aria-label={`Selecionar parcela ${installment.currentInstallment} de ${group.totalInstallments}`}
                  />

                  <div className="flex min-w-0 flex-1 items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-medium">
                        Parcela {installment.currentInstallment}/
                        {group.totalInstallments}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Vencimento: {dueDate}
                      </p>
                    </div>

                    <MoneyValues
                      amount={installment.amount}
                      className="shrink-0 text-sm"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
