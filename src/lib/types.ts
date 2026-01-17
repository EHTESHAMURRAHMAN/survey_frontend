export type ID = string;

export type Company = { id: ID; name: string; logoUrl?: string };
export type Survey = { id: ID; companyId: ID; name: string; status: "ACTIVE"|"INACTIVE"; totalCount: number; url?: string };
export type QuestionType = "radio" | "checkbox" | "text" | "select";
export type Question = {
  id: ID; companyId: ID; surveyId: ID;
  segment: string; segmentTitle?: string;
  text: string; details?: string; type: QuestionType;
};
export type RiskLevel = "Red" | "Amber" | "Green";
export type Option = { id: ID; questionId: ID; text: string; risk: RiskLevel };
export type ResultRow = {
  id: ID; companyId: ID; surveyId: ID; questionId: ID; optionId?: ID;
  total: number; percentage?: number;
};
