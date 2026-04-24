export interface SurveyUIConfig {
  config: {
    backgroundImage: string;
    poweredBy: { logo: string };
    disclaimer: { text: string, emailFieldName?: string; };
    checkbox: { text: string };
  }
}
