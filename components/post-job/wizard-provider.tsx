"use client";

import { useState } from "react";
import { StepGeneralInfo } from "./step-general-info";
import { StepPropertyTraits } from "./step-property-traits";
import { StepLogistics } from "./step-logistics";

type WizardStep = "general" | "traits" | "logistics";

const stepLabels: Record<WizardStep, string> = {
  general: "Општи информации",
  traits: "Карактеристики на имотот",
  logistics: "Логистика и буџет",
};

const stepNumbers: Record<WizardStep, number> = {
  general: 1,
  traits: 2,
  logistics: 3,
};

export function PostJobWizard() {
  const [currentStep, setCurrentStep] = useState<WizardStep>("general");

  const goTo = (step: WizardStep) => setCurrentStep(step);

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        {(["general", "traits", "logistics"] as WizardStep[]).map((step, i) => (
          <div key={step} className="flex items-center gap-2">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium"
            >
              <span className="sr-only">Step {i + 1}</span>
            </div>
            <span className={`text-sm ${currentStep === step ? "font-semibold" : "text-muted-foreground"}`}>
              {stepLabels[step]}
            </span>
          </div>
        ))}
      </div>

      {currentStep === "general" && <StepGeneralInfo onNext={() => goTo("traits")} />}
      {currentStep === "traits" && (
        <StepPropertyTraits onNext={() => goTo("logistics")} onBack={() => goTo("general")} />
      )}
      {currentStep === "logistics" && (
        <StepLogistics onBack={() => goTo("traits")} />
      )}
    </div>
  );
}
