// admin/invoicing-page.tsx
import { InvoiceTable } from "@/components/caissierComponents/InvoiceTable";

export default function InvoicingPage() {
  return (
    <div className="@container/main flex flex-1 flex-col gap-8 py-4 md:gap-10 md:py-6">
      <section>
        <div className="mb-6 px-4 lg:px-6">
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-50 sm:text-4xl">
            Gestion des Factures
          </h2>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
            Créez, consultez et gérez les factures clients.
          </p>
        </div>
        <div className="px-4 lg:px-6">
          <InvoiceTable />
        </div>
      </section>
    </div>
  );
}