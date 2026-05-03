"use client";

import { BarChart2, FileText } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

type AuditSummary = {
  totalAudits: number;
  totalCompanies: number;
  companyStats: { company: string; count: number }[];
};

function Tile({
  icon,
  title,
  value,
  href,
}: {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  href: string;
}) {
  return (
    <Link href={href} className="block">
      <div className="rounded-[28px] bg-[#a5e7e7] p-5 shadow-[8px_8px_16px_#9dc1be,_-8px_-8px_16px_#e7fffd]">
        <div className="mb-4 flex justify-center">{icon}</div>
        <div className="text-center text-[26px] font-extrabold leading-tight">
          {title}
        </div>
        <div className="mt-2 text-center text-[32px] font-extrabold">
          {value}
        </div>
      </div>
    </Link>
  );
}

function publicApiUrl(path: string) {
  const base = (process.env.NEXT_PUBLIC_API_URL || "/api").replace(/\/+$/, "");
  return `${base}${path}`;
}

export default function DashboardPage() {
  const [auditSummary, setAuditSummary] = useState<AuditSummary | null>(null);
  const [auditSummaryLoading, setAuditSummaryLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetch(publicApiUrl("/public/audits/summary"));
        const data = await res.json();
        setAuditSummary(data);
      } catch (err) {
        console.error(err);
      } finally {
        setAuditSummaryLoading(false);
      }
    };

    loadData();
  }, []);

  const companiesStartedByCount =
    auditSummary?.companyStats?.filter((item) => item.company?.trim().length > 0)
      .length ??
    auditSummary?.totalCompanies ??
    0;

  return (
    <section className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Tile
          icon={<FileText className="h-12 w-12 text-[#0c5b67]" />}
          title="Companies"
          value={auditSummaryLoading ? "..." : companiesStartedByCount}
          href="/audits-started-by"
        />

        <Tile
          icon={<BarChart2 className="h-12 w-12 text-[#0c5b67]" />}
          title="Audits done "
          value={auditSummaryLoading ? "..." : auditSummary?.totalAudits ?? 0}
          href="/results"
        />
      </div>
    </section>
  );
}
