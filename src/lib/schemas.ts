import { z } from "zod";
export const CompanySchema = z.object({ name: z.string().min(2), logoUrl: z.string().url().optional() });
export const SurveySchema  = z.object({ companyId: z.string(), name: z.string().min(2), status: z.enum(["ACTIVE","INACTIVE"]) });
export const QuestionSchema = z.object({
  companyId: z.string(), surveyId: z.string(),
  segment: z.string().min(1), segmentTitle: z.string().optional(),
  text: z.string().min(5), details: z.string().optional(),
  type: z.enum(["radio","checkbox","text","select"]),
});
export const OptionSchema = z.object({ questionId: z.string(), text: z.string().min(1), risk: z.enum(["Red","Amber","Green"])});
