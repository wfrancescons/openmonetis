"use client";

import MoneyValues from "@/components/money-values";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils/ui";
import { RiArrowDownSLine, RiArrowRightSLine, RiBillLine } from "@remixicon/react";
import { format, parse } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useState } from "react";
import type { PendingInvoice } from "./types";
import Image from "next/image";

type PendingInvoiceCardProps = {
  invoice: PendingInvoice;
  isSelected: boolean;
  onToggle: () => void;
};

export function PendingInvoiceCard({
  invoice,
  isSelected,
  onToggle,
}: PendingInvoiceCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Formatar período (YYYY-MM) para texto legível
  const periodDate = parse(invoice.period, "yyyy-MM", new Date());
  const periodText = format(periodDate, "MMMM 'de' yyyy", { locale: ptBR });

  // Calcular data de vencimento aproximada
  const dueDay = parseInt(invoice.dueDay, 10);
  const dueDate = new Date(periodDate);
  dueDate.setDate(dueDay);
  const dueDateText = format(dueDate, "dd/MM/yyyy", { locale: ptBR });

  return (
    <Card className={cn(isSelected && "border-primary/50 bg-primary/5")}>
      <CardContent className="flex flex-col gap-3 py-4">
        {/* Header do card */}
        <div className="flex items-start gap-3">
          <Checkbox
            checked={isSelected}
            onCheckedChange={onToggle}
            className="mt-1"
            aria-label={`Selecionar fatura ${invoice.cartaoName} - ${periodText}`}
          />

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  {invoice.cartaoLogo ? (
                    <Image
                      src={invoice.cartaoLogo}
                      alt={invoice.cartaoName}
                      width={24}
                      height={24}
                      className="size-6 rounded"
                    />
                  ) : (
                    <div className="flex size-6 items-center justify-center rounded bg-muted">
                      <RiBillLine className="size-4 text-muted-foreground" />
                    </div>
                  )}
                  <p className="font-medium">{invoice.cartaoName}</p>
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  <span className="capitalize">{periodText}</span>
                  <span>•</span>
                  <span>Vencimento: {dueDateText}</span>
                </div>
              </div>

              <MoneyValues
                amount={invoice.totalAmount}
                className="shrink-0 text-sm font-semibold"
              />
            </div>

            {/* Badge de status */}
            <div className="mt-2 flex flex-wrap gap-2">
              <Badge variant="destructive" className="text-xs">
                Pendente
              </Badge>
              <Badge variant="secondary" className="text-xs">
                {invoice.lancamentos.length}{" "}
                {invoice.lancamentos.length === 1
                  ? "lançamento"
                  : "lançamentos"}
              </Badge>
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
                  Ocultar lançamentos ({invoice.lancamentos.length})
                </>
              ) : (
                <>
                  <RiArrowRightSLine className="size-4" />
                  Ver lançamentos ({invoice.lancamentos.length})
                </>
              )}
            </button>
          </div>
        </div>

        {/* Lista de lançamentos expandida */}
        {isExpanded && (
          <div className="ml-9 mt-2 flex flex-col gap-2 border-l-2 border-muted pl-4">
            {invoice.lancamentos.map((lancamento) => {
              const purchaseDate = format(
                lancamento.purchaseDate,
                "dd/MM/yyyy",
                { locale: ptBR }
              );

              const installmentLabel =
                lancamento.condition === "Parcelado" &&
                lancamento.currentInstallment &&
                lancamento.installmentCount
                  ? `${lancamento.currentInstallment}/${lancamento.installmentCount}`
                  : null;

              return (
                <div
                  key={lancamento.id}
                  className="flex items-center gap-3 rounded-md border p-2"
                >
                  <div className="flex min-w-0 flex-1 items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">
                        {lancamento.name}
                      </p>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                        <span>{purchaseDate}</span>
                        {installmentLabel && (
                          <>
                            <span>•</span>
                            <span>Parcela {installmentLabel}</span>
                          </>
                        )}
                        {lancamento.condition !== "Parcelado" && (
                          <>
                            <span>•</span>
                            <span>{lancamento.condition}</span>
                          </>
                        )}
                      </div>
                    </div>

                    <MoneyValues
                      amount={lancamento.amount}
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
