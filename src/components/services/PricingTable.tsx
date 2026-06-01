import { formatPrice } from "@/lib/utils";
import type { ServiceItem } from "@/services/booking/types";

type PricingTableProps = {
  services: ServiceItem[];
};

export function PricingTable({ services }: PricingTableProps) {
  return (
    <div className="overflow-x-auto rounded-xl border border-[var(--border)]">
      <table className="w-full min-w-[480px] text-left text-sm">
        <caption className="sr-only">Service pricing</caption>
        <thead className="bg-[var(--bg-secondary)]">
          <tr>
            <th scope="col" className="px-4 py-3 font-semibold text-[var(--text-primary)]">
              Service
            </th>
            <th scope="col" className="px-4 py-3 font-semibold text-[var(--text-primary)]">
              Duration
            </th>
            <th scope="col" className="px-4 py-3 font-semibold text-[var(--text-primary)]">
              Price
            </th>
          </tr>
        </thead>
        <tbody>
          {services.map((service, i) => (
            <tr
              key={service.id}
              className={i % 2 === 0 ? "bg-[var(--bg-primary)]" : "bg-[var(--bg-secondary)]"}
            >
              <td className="px-4 py-3 font-medium text-[var(--text-primary)]">
                {service.name}
              </td>
              <td className="px-4 py-3 text-[var(--text-muted)]">
                {service.durationMin} min
              </td>
              <td className="px-4 py-3 font-semibold text-[var(--accent)]">
                {formatPrice(service.price)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
