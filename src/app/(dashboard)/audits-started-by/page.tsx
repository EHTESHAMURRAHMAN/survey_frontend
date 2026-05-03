"use client";

import { useEffect, useState } from "react";

type CompanyStat = {
  company: string;
  count: number;
};

function sortCompanyStats(companyStats: CompanyStat[]) {
  return [...companyStats].sort((a, b) => {
    const countDifference = b.count - a.count;

    if (countDifference !== 0) {
      return countDifference;
    }

    return a.company.localeCompare(b.company, undefined, {
      sensitivity: "base",
    });
  });
}

function publicApiUrl(path: string) {
  const base = (process.env.NEXT_PUBLIC_API_URL || "/api").replace(/\/+$/, "");
  return `${base}${path}`;
}

export default function CompaniesSummary() {
  const [data, setData] = useState<CompanyStat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(publicApiUrl("/public/audits/summary"))
      .then((res) => res.json())
      .then((res) => {
        const companyStats = Array.isArray(res.companyStats)
          ? res.companyStats
          : [];
        setData(
          sortCompanyStats(
            companyStats.filter(
              (item: CompanyStat) => item.company?.trim().length > 0
            )
          )
        );
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="space-y-6">
      <div className="rounded-[18px] bg-white p-6 shadow-[0_12px_40px_rgba(0,0,0,0.08)]">
        <h1 className="mb-4 text-xl font-bold">List of audits started by</h1>

        <div className="overflow-hidden rounded-lg border bg-white shadow">
          <table className="w-full border-collapse text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="border-bottom p-3 text-gray-700">S.No</th>
                <th className="border-bottom p-3 text-gray-700">Company Name</th>
                <th className="border-bottom p-3 text-gray-700 text-center">Audits Count</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={3} className="p-4 text-center text-gray-500">
                    Loading...
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={3} className="p-4 text-center text-gray-500">
                    No data found
                  </td>
                </tr>
              ) : (
                data.map((item, index) => (
                  <tr key={item.company} className="hover:bg-gray-50">
                    <td className="border-bottom p-3">{index + 1}</td>
                    <td className="border-bottom p-3 font-medium">{item.company}</td>
                    <td className="border-bottom p-3 text-center">{item.count}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
