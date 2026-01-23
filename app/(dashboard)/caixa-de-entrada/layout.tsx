import PageDescription from "@/components/page-description";
import { RiInbox2Line } from "@remixicon/react";

export const metadata = {
  title: "Caixa de Entrada | Opensheets",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-6 px-6">
      <PageDescription
        icon={<RiInbox2Line />}
        title="Caixa de Entrada"
        subtitle="Visialize seus lançamentos pendentes"
      />
      {children}
    </section>
  );
}
