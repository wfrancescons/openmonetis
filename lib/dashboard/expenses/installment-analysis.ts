import { cartoes, faturas, lancamentos, pagadores } from "@/db/schema";
import {
  ACCOUNT_AUTO_INVOICE_NOTE_PREFIX,
  INITIAL_BALANCE_NOTE,
} from "@/lib/accounts/constants";
import { db } from "@/lib/db";
import { toNumber } from "@/lib/dashboard/common";
import { INVOICE_PAYMENT_STATUS } from "@/lib/faturas";
import { and, eq, isNotNull, isNull, ne, or, sql } from "drizzle-orm";

export type InstallmentDetail = {
  id: string;
  currentInstallment: number;
  amount: number;
  dueDate: Date | null;
  period: string;
  isAnticipated: boolean;
  purchaseDate: Date;
};

export type InstallmentGroup = {
  seriesId: string;
  name: string;
  paymentMethod: string;
  cartaoId: string | null;
  cartaoName: string | null;
  totalInstallments: number;
  paidInstallments: number;
  pendingInstallments: InstallmentDetail[];
  totalPendingAmount: number;
  firstPurchaseDate: Date;
};

export type PendingInvoiceLancamento = {
  id: string;
  name: string;
  amount: number;
  purchaseDate: Date;
  condition: string;
  currentInstallment: number | null;
  installmentCount: number | null;
};

export type PendingInvoice = {
  invoiceId: string | null;
  cartaoId: string;
  cartaoName: string;
  cartaoLogo: string | null;
  period: string;
  totalAmount: number;
  dueDay: string;
  lancamentos: PendingInvoiceLancamento[];
};

export type InstallmentAnalysisData = {
  installmentGroups: InstallmentGroup[];
  pendingInvoices: PendingInvoice[];
  totalPendingInstallments: number;
  totalPendingInvoices: number;
};

export async function fetchInstallmentAnalysis(
  userId: string
): Promise<InstallmentAnalysisData> {
  // 1. Buscar todos os lançamentos parcelados não antecipados e não pagos
  const installmentRows = await db
    .select({
      id: lancamentos.id,
      seriesId: lancamentos.seriesId,
      name: lancamentos.name,
      amount: lancamentos.amount,
      paymentMethod: lancamentos.paymentMethod,
      currentInstallment: lancamentos.currentInstallment,
      installmentCount: lancamentos.installmentCount,
      dueDate: lancamentos.dueDate,
      period: lancamentos.period,
      isAnticipated: lancamentos.isAnticipated,
      purchaseDate: lancamentos.purchaseDate,
      cartaoId: lancamentos.cartaoId,
      cartaoName: cartoes.name,
    })
    .from(lancamentos)
    .leftJoin(cartoes, eq(lancamentos.cartaoId, cartoes.id))
    .where(
      and(
        eq(lancamentos.userId, userId),
        eq(lancamentos.transactionType, "Despesa"),
        eq(lancamentos.condition, "Parcelado"),
        eq(lancamentos.isAnticipated, false),
        isNotNull(lancamentos.seriesId),
        or(
          isNull(lancamentos.note),
          and(
            sql`${lancamentos.note} != ${INITIAL_BALANCE_NOTE}`,
            sql`${lancamentos.note} NOT LIKE ${`${ACCOUNT_AUTO_INVOICE_NOTE_PREFIX}%`}`
          )
        )
      )
    )
    .orderBy(lancamentos.purchaseDate, lancamentos.currentInstallment);

  // Agrupar por seriesId
  const seriesMap = new Map<string, InstallmentGroup>();

  for (const row of installmentRows) {
    if (!row.seriesId) continue;

    const amount = Math.abs(toNumber(row.amount));
    const installmentDetail: InstallmentDetail = {
      id: row.id,
      currentInstallment: row.currentInstallment ?? 1,
      amount,
      dueDate: row.dueDate,
      period: row.period,
      isAnticipated: row.isAnticipated ?? false,
      purchaseDate: row.purchaseDate,
    };

    if (seriesMap.has(row.seriesId)) {
      const group = seriesMap.get(row.seriesId)!;
      group.pendingInstallments.push(installmentDetail);
      group.totalPendingAmount += amount;
    } else {
      seriesMap.set(row.seriesId, {
        seriesId: row.seriesId,
        name: row.name,
        paymentMethod: row.paymentMethod,
        cartaoId: row.cartaoId,
        cartaoName: row.cartaoName,
        totalInstallments: row.installmentCount ?? 0,
        paidInstallments: 0,
        pendingInstallments: [installmentDetail],
        totalPendingAmount: amount,
        firstPurchaseDate: row.purchaseDate,
      });
    }
  }

  // Calcular quantas parcelas já foram pagas para cada grupo
  const installmentGroups = Array.from(seriesMap.values()).map((group) => {
    const minPendingInstallment = Math.min(
      ...group.pendingInstallments.map((i) => i.currentInstallment)
    );
    group.paidInstallments = minPendingInstallment - 1;
    return group;
  });

  // 2. Buscar faturas pendentes
  const invoiceRows = await db
    .select({
      invoiceId: faturas.id,
      cardId: cartoes.id,
      cardName: cartoes.name,
      cardLogo: cartoes.logo,
      dueDay: cartoes.dueDay,
      period: faturas.period,
      paymentStatus: faturas.paymentStatus,
    })
    .from(faturas)
    .innerJoin(cartoes, eq(faturas.cartaoId, cartoes.id))
    .where(
      and(
        eq(faturas.userId, userId),
        eq(faturas.paymentStatus, INVOICE_PAYMENT_STATUS.PENDING)
      )
    );

  // Buscar lançamentos de cada fatura pendente
  const pendingInvoices: PendingInvoice[] = [];

  for (const invoice of invoiceRows) {
    const invoiceLancamentos = await db
      .select({
        id: lancamentos.id,
        name: lancamentos.name,
        amount: lancamentos.amount,
        purchaseDate: lancamentos.purchaseDate,
        condition: lancamentos.condition,
        currentInstallment: lancamentos.currentInstallment,
        installmentCount: lancamentos.installmentCount,
      })
      .from(lancamentos)
      .where(
        and(
          eq(lancamentos.userId, userId),
          eq(lancamentos.cartaoId, invoice.cardId),
          eq(lancamentos.period, invoice.period ?? "")
        )
      )
      .orderBy(lancamentos.purchaseDate);

    const totalAmount = invoiceLancamentos.reduce(
      (sum, l) => sum + Math.abs(toNumber(l.amount)),
      0
    );

    if (totalAmount > 0) {
      pendingInvoices.push({
        invoiceId: invoice.invoiceId,
        cartaoId: invoice.cardId,
        cartaoName: invoice.cardName,
        cartaoLogo: invoice.cardLogo,
        period: invoice.period ?? "",
        totalAmount,
        dueDay: invoice.dueDay,
        lancamentos: invoiceLancamentos.map((l) => ({
          id: l.id,
          name: l.name,
          amount: Math.abs(toNumber(l.amount)),
          purchaseDate: l.purchaseDate,
          condition: l.condition,
          currentInstallment: l.currentInstallment,
          installmentCount: l.installmentCount,
        })),
      });
    }
  }

  // Calcular totais
  const totalPendingInstallments = installmentGroups.reduce(
    (sum, group) => sum + group.totalPendingAmount,
    0
  );

  const totalPendingInvoices = pendingInvoices.reduce(
    (sum, invoice) => sum + invoice.totalAmount,
    0
  );

  return {
    installmentGroups,
    pendingInvoices,
    totalPendingInstallments,
    totalPendingInvoices,
  };
}
