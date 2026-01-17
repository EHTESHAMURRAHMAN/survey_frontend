import { http, HttpResponse } from "msw";

// --- Fixed dummy data 
const companies = [
  {
    id: "1",
    name: "new",
    logoUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/PNG_transparency_demonstration_1.png/160px-PNG_transparency_demonstration_1.png",
  },
  {
    id: "2",
    name: "Internet Explorer Team",
    logoUrl:
      "https://upload.wikimedia.org/wikipedia/commons/1/1b/Internet_Explorer_9_icon.svg",
  },
  {
    id: "3",
    name: "Dexbit",
    logoUrl:
      "https://upload.wikimedia.org/wikipedia/commons/3/3f/Black_square.jpg",
  },
] as any[];

const surveys = [
  { id: "1", companyId: "1", name: "aeda", status: "ACTIVE", totalCount: 1, url: "https://example.com/s/1" },
  { id: "2", companyId: "2", name: "Internet Explorer Test", status: "ACTIVE", totalCount: 9, url: "https://example.com/s/2" },
  { id: "3", companyId: "3", name: "App Survey DEX", status: "ACTIVE", totalCount: 0, url: "https://example.com/s/3" },
] as any[];

const questions = [
  {
    id: "1",
    companyId: "2",
    surveyId: "2",
    segment: "Segment: 1",
    segmentTitle: "Test 1",
    text: "How often do you use Internet Explorer?",
    details:
      "We want to understand how frequently Internet Explorer is used compared to other browsers.",
    type: "radio",
  },
] as any[];

const options = [
  { id: "1", questionId: "1", text: "Daily", risk: "Green" },
  { id: "2", questionId: "1", text: "Weekly", risk: "Amber" },
  { id: "3", questionId: "1", text: "Rarely", risk: "Red" },
] as any[];

const results = [] as any[];

function q(req: Request) {
  return Object.fromEntries(new URL(req.url).searchParams.entries());
}
function notFound() {
  return new HttpResponse("Not found", { status: 404 });
}

export const handlers = [
  // Companies
  http.get("/api/companies", () => HttpResponse.json(companies)),
  http.post("/api/companies", async ({ request }) => {
    const body = (await request.json()) as any;
    const id = String(companies.length + 1);
    companies.push({ id, ...body });
    return HttpResponse.json({ id, ok: true });
  }),
  http.put("/api/companies/:id", async ({ params, request }) => {
    const idx = companies.findIndex((c) => c.id === params.id);
    if (idx === -1) return notFound();
    const body = (await request.json()) as any;
    companies[idx] = { ...companies[idx], ...body };
    return HttpResponse.json({ ok: true });
  }),
  http.delete("/api/companies/:id", ({ params }) => {
    const idx = companies.findIndex((c) => c.id === params.id);
    if (idx === -1) return notFound();
    companies.splice(idx, 1);
    return HttpResponse.json({ ok: true });
  }),

  // Surveys
  http.get("/api/surveys", ({ request }) => {
    const { companyId } = q(request);
    const filtered = companyId ? surveys.filter((s) => s.companyId === companyId) : surveys;
    return HttpResponse.json(filtered);
  }),
  http.post("/api/surveys", async ({ request }) => {
    const body = (await request.json()) as any;
    const id = String(surveys.length + 1);
    surveys.push({ id, totalCount: 0, status: "ACTIVE", ...body });
    return HttpResponse.json({ id, ok: true });
  }),
  http.put("/api/surveys/:id", async ({ params, request }) => {
    const idx = surveys.findIndex((s) => s.id === params.id);
    if (idx === -1) return notFound();
    const body = (await request.json()) as any;
    surveys[idx] = { ...surveys[idx], ...body };
    return HttpResponse.json({ ok: true });
  }),
  http.delete("/api/surveys/:id", ({ params }) => {
    const idx = surveys.findIndex((s) => s.id === params.id);
    if (idx === -1) return notFound();
    surveys.splice(idx, 1);
    return HttpResponse.json({ ok: true });
  }),

  // Questions
  http.get("/api/questions", ({ request }) => {
    const { surveyId } = q(request);
    const filtered = surveyId ? questions.filter((qn) => qn.surveyId === surveyId) : questions;
    return HttpResponse.json(filtered);
  }),
  http.post("/api/questions", async ({ request }) => {
    const body = (await request.json()) as any;
    const id = String(questions.length + 1);
    questions.push({ id, ...body });
    return HttpResponse.json({ id, ok: true });
  }),

  // Options
  http.get("/api/options", ({ request }) => {
    const { questionId } = q(request);
    const filtered = questionId ? options.filter((o) => o.questionId === questionId) : options;
    return HttpResponse.json(filtered);
  }),
  http.post("/api/options", async ({ request }) => {
    const body = (await request.json()) as any;
    const id = String(options.length + 1);
    options.push({ id, ...body });
    return HttpResponse.json({ id, ok: true });
  }),

  // Results (read-only demo)
  http.get("/api/results", () => HttpResponse.json(results)),
];
