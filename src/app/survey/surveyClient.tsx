"use client";

import { SurveyUIConfig } from "@/types/uiConfig";

interface Props {
  uiConfig: SurveyUIConfig;
}

export default function SurveyClient({ uiConfig }: Props) {
  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{
        backgroundImage: `url(${uiConfig.config.backgroundImage})`
      }}
    >
      <div className="p-6 max-w-md mx-auto bg-white/80 rounded">
        <label className="flex gap-2 items-center">
          <input type="checkbox" />
          <span>{uiConfig.config.checkbox.text}</span>
        </label>

        <p className="text-xs mt-4 text-gray-600">
          {uiConfig.config.disclaimer.text}
        </p>

        <div className="mt-6 flex justify-center">
          <img
            src={uiConfig.config.poweredBy.logo}
            alt="Powered by"
            className="h-8"
          />
        </div>
      </div>
    </div>
  );
}
