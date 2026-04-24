"use client";

import { useEffect, useState } from "react";

type CompanyStat = {
  company: string;
  count: number;
};

export default function CompaniesSummary() {
  const [data, setData] = useState<CompanyStat[]>([]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/public/audits/summary`)
      .then((res) => res.json())
      .then((res) => {
        setData(res.companyStats || []);
      })
      .catch(console.error);
  }, []);

  return (
    <div className="p-6">

      <h1 className="text-xl font-bold mb-4">
        List of audits started by
      </h1>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="w-full text-left border-collapse">

          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 border">S.No</th>
              <th className="p-3 border">Company Name</th>
              <th className="p-3 border text-center">Audits Count</th>
            </tr>
          </thead>

          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={3} className="text-center p-4">
                  No data found
                </td>
              </tr>
            ) : (
              data.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="p-3 border">{index + 1}</td>
                  <td className="p-3 border font-medium">
                    {item.company}
                  </td>
                  <td className="p-3 border text-center">
                    {item.count}
                  </td>
                </tr>
              ))
            )}
          </tbody>

        </table>
      </div>

    </div>
  );
}