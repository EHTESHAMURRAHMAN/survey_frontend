"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import client from "@/lib/client";

type Company = { id: string; name: string };
type Survey = { id: string; companyId: string; name: string };

type ResultRow = {
  id?: string;
  companyId?: string;
  surveyId?: string;
  questionId?: string;
  optionId?: string;
  questionText?: string;
  optionText?: string;
  type?: string;
  total?: number;
  count?: number;
  percentage?: number; // 0..100
};

type DisplayRow = {
  surveyId: string;
  companyId: string;
  surveyName: string;
  companyName: string;
  auditCount: number;
};

export default function SurveyResultsPage() {
  const { data: companies = [], isLoading: companiesLoading } = useQuery<
    Company[]
  >({
    queryKey: ["companies"],
    queryFn: () => client.get("/companies"),
  });

  const { data: surveys = [], isLoading: surveysLoading } = useQuery<Survey[]>({
    queryKey: ["surveys"],
    queryFn: () => client.get("/surveys"),
  });

  const { data: results = [], isLoading: resultsLoading } = useQuery<
    ResultRow[]
  >({
    queryKey: ["results"],
    queryFn: () => client.get("/results"),
  });

  const companyName = useMemo(() => {
    const m = new Map<string, string>();
    companies.forEach((c) => m.set(c.id, c.name));
    return (id?: string) => (id ? m.get(id) ?? "-" : "-");
  }, [companies]);

  const [filterCompanyId, setFilterCompanyId] = useState<string>("");
  const [filterSurveyId, setFilterSurveyId] = useState<string>("");

  const surveysForCompany = useMemo(() => {
    if (!filterCompanyId) return surveys;
    return surveys.filter((s) => s.companyId === filterCompanyId);
  }, [surveys, filterCompanyId]);

  const displayRows = useMemo<DisplayRow[]>(() => {
    const auditCountsBySurvey = new Map<string, number>();

    results.forEach((r) => {
      if (!r.surveyId) return;
      const count = typeof r.count === "number" ? r.count : 1;
      auditCountsBySurvey.set(
        r.surveyId,
        (auditCountsBySurvey.get(r.surveyId) || 0) + count
      );
    });

    return surveys
      .filter((s) => !filterCompanyId || s.companyId === filterCompanyId)
      .filter((s) => !filterSurveyId || s.id === filterSurveyId)
      .map((s) => ({
        surveyId: s.id,
        companyId: s.companyId,
        surveyName: s.name,
        companyName: companyName(s.companyId),
        auditCount: auditCountsBySurvey.get(s.id) || 0,
      }));
  }, [results, surveys, filterCompanyId, filterSurveyId, companyName]);

  const isLoading = companiesLoading || surveysLoading || resultsLoading;

  return (
    <section className="space-y-6 overflow-x-hidden">
      <div className="rounded-[18px] bg-[#bfe3df] p-6">
        <h2 className="mb-4 text-[24px] font-semibold">
          Survey Result By Company and Category
        </h2>

        <div className="space-y-8">
          <div>
            <div className="mb-1 text-xs">Company</div>
            <select
              value={filterCompanyId}
              onChange={(e) => {
                setFilterCompanyId(e.target.value);
                setFilterSurveyId("");
              }}
              className="h-10 w-[280px] rounded-sm bg-[#1c8ed8] px-3 text-white outline-none"
            >
              <option value="">Select Company</option>
              {companies.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <div className="mb-1 text-xs">Survey</div>
            <select
              value={filterSurveyId}
              onChange={(e) => {
                setFilterSurveyId(e.target.value);
              }}
              className="h-10 w-[280px] rounded-sm bg-[#1c8ed8] px-3 text-white outline-none disabled:opacity-60"
              disabled={!!filterCompanyId && !surveysForCompany.length}
            >
              <option value="">Select Survey</option>
              {surveysForCompany.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="rounded-[18px] bg-white p-6 shadow-[0_12px_40px_rgba(0,0,0,0.08)]">
        <div className="overflow-hidden rounded-md border">
          <table className="min-w-full">
            <thead className="bg-gray-100">
              <tr className="text-left text-[15px]">
                <th className="px-4 py-3 font-semibold text-gray-700">S.No.</th>
                <th className="px-4 py-3 font-semibold text-gray-700">
                  Company Name
                </th>
                <th className="px-4 py-3 font-semibold text-gray-700">
                  Survey Name
                </th>
                <th className="px-4 py-3 font-semibold text-gray-700">
                  Audit Count
                </th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {isLoading ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    Loading...
                  </td>
                </tr>
              ) : displayRows.length ? (
                displayRows.map((row, i) => (
                  <tr key={row.surveyId} className="bg-white hover:bg-gray-50">
                    <td className="px-4 py-4 text-[15px]">{i + 1}</td>
                    <td className="px-4 py-4 text-[15px]">
                      {row.companyName}
                    </td>
                    <td className="px-4 py-4 text-[15px]">
                      {row.surveyName}
                    </td>
                    <td className="px-4 py-4 text-[15px] font-semibold">
                      {row.auditCount}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    No data found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
