"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import client from "@/lib/client";

type Company = { id: string; name: string };
type Survey = { id: string; companyId: string; name: string };

type ResultRow = {
  id: string;
  companyId?: string;
  surveyId?: string;
  questionId?: string;
  optionId?: string;
  questionText?: string;
  optionText?: string;
  type?: string;
  total?: number;
  percentage?: number; // 0..100
};

export default function SurveyResultsPage() {
  // data
  const { data: companies = [] } = useQuery<Company[]>({
    queryKey: ["companies"],
    queryFn: () => client.get("/companies"),
  });
  const { data: surveys = [] } = useQuery<Survey[]>({
    queryKey: ["surveys"],
    queryFn: () => client.get("/surveys"),
  });
  const { data: results = [] } = useQuery<ResultRow[]>({
    queryKey: ["results"],
    queryFn: () => client.get("/results"),
  });

  // maps for quick name lookups
  const companyName = useMemo(() => {
    const m = new Map<string, string>();
    companies.forEach((c) => m.set(c.id, c.name));
    return (id?: string) => (id ? m.get(id) ?? "-" : "-");
  }, [companies]);

  const surveyById = useMemo(() => {
    const m = new Map<string, Survey>();
    surveys.forEach((s) => m.set(s.id, s));
    return (id?: string) => (id ? m.get(id) : undefined);
  }, [surveys]);

  // filters in the blue card
  const [filterCompanyId, setFilterCompanyId] = useState<string>("");
  const [filterSurveyId, setFilterSurveyId] = useState<string>("");

  const surveysForCompany = useMemo(() => {
    if (!filterCompanyId) return surveys;
    return surveys.filter((s) => s.companyId === filterCompanyId);
  }, [surveys, filterCompanyId]);

  const label = useMemo(() => {
    if (filterCompanyId) return "Company Name";
    if (filterSurveyId) return "Survey Name";
    return "";
  }, [filterCompanyId, filterSurveyId]);

  const displayData = useMemo(() => {
    const map = new Map<string, number>();

    results.forEach((r) => {
      // 🔹 Company wise
      if (filterCompanyId && r.companyId === filterCompanyId) {
        map.set(r.companyId, (map.get(r.companyId) || 0) + 1);
      }

      // 🔹 Survey wise
      if (filterSurveyId && r.surveyId === filterSurveyId) {
        map.set(r.surveyId, (map.get(r.surveyId) || 0) + 1);
      }
    });

    return Array.from(map.entries()).map(([id, count]) => ({
      id,
      count,
    }));
  }, [results, filterCompanyId, filterSurveyId]);

  return (
    <section className="space-y-6 overflow-x-hidden">
      {/* Top filter card */}
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

      {/* Results card */}
      <div className="rounded-[18px] bg-white p-6 shadow-[0_12px_40px_rgba(0,0,0,0.08)]">
        <div className="mt-6">
          {label ? (
            <>
              <h2 className="text-xl font-bold mb-4">{label}</h2>

              <div className="space-y-2">
                {displayData.map((item, i) => (
                  <div
                    key={i}
                    className="flex justify-between border-b pb-2 text-[16px]"
                  >
                    <span>{filterCompanyId ? companyName(item.id) : surveyById(item.id)?.name || ""}</span>
                    <span className="font-semibold">{item.count}</span>
                  </div>
                ))}

                {!displayData.length && (
                  <div className="text-gray-500 text-sm">No data found</div>
                )}
              </div>
            </>
          ) : (
            <div className="text-gray-500 text-sm">
              Please select Company or Survey
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
