"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { CardDetailData } from "@/lib/relatorios/cartoes-report";
import { RiShoppingBag3Line } from "@remixicon/react";

type CardTopExpensesProps = {
  data: CardDetailData["topExpenses"];
};

export function CardTopExpenses({ data }: CardTopExpensesProps) {
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
            Maiores Gastos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
            <RiShoppingBag3Line className="size-8 mb-2" />
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
          Top 10 Gastos do Mês
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {data.map((expense, index) => (
            <div
              key={expense.id}
              className="flex items-center justify-between py-2 border-b last:border-b-0"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-xs text-muted-foreground w-5">
                  {index + 1}.
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate max-w-[200px]">
                    {expense.name}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{expense.date}</span>
                    {expense.category && (
                      <>
                        <span>•</span>
                        <span className="truncate max-w-[100px]">
                          {expense.category}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <span className="text-sm font-medium text-red-500 shrink-0">
                {formatCurrency(expense.amount)}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
