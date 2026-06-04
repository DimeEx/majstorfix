"use client";

import { useState } from "react";
import { StepGeneralInfo } from "./step-general-info";
import { StepPropertyTraits } from "./step-property-traits";
import { StepLogistics } from "./step-logistics";
import { Check } from "lucide-react";

type WizardStep = "general" | "traits" | "logistics";

const steps: { key: WizardStep; label: string; number: number }[] = [
  { key: "general", label: "Општи информации", number: 1 },
  { key: "traits", label: "Карактеристики на имотот", number: 2 },
  { key: "logistics", label: "Логистика и буџет", number: 3 },
];

export function PostJobWizard() {
  const [currentStep, setCurrentStep] = useState<WizardStep>("general");

  const currentIndex = steps.findIndex((s) => s.key === currentStep);

  const goTo = (step: WizardStep) => setCurrentStep(step);

  return (
    <div>
      {/* Step Progress */}
      <div className="relative mb-10">
        <div className="absolute top-5 left-0 right-0 h-px bg-border" />
        <div
          className="absolute top-5 left-0 h-px bg-primary transition-all duration-500 ease-in-out"
          style={{ width: `${(currentIndex / (steps.length - 1)) * 100}%` }}
        />
        <div className="relative flex justify-between">
          {steps.map((step, i) => {
            const isCompleted = i < currentIndex;
            const isCurrent = i === currentIndex;
            return (
              <div key={step.key} className="flex flex-col items-center gap-2">
                <div
                  className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full text-sm font-medium transition-all duration-300 ${
                    isCompleted
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                      : isCurrent
                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25 ring-4 ring-primary/15"
                        : "bg-muted text-muted-foreground"
                  }`}
                >
                  {isCompleted ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    step.number
                  )}
                </div>
                <span
                  className={`hidden sm:block text-xs font-medium transition-colors ${
                    isCurrent
                      ? "text-foreground"
                      : isCompleted
                        ? "text-primary"
                        : "text-muted-foreground"
                  }`}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-card rounded-2xl border border-border/50 shadow-sm shadow-border/50 p-6 sm:p-8">
        {currentStep === "general" && <StepGeneralInfo onNext={() => goTo("traits")} />}
        {currentStep === "traits" && (
          <StepPropertyTraits onNext={() => goTo("logistics")} onBack={() => goTo("general")} />
        )}
        {currentStep === "logistics" && (
          <StepLogistics onBack={() => goTo("traits")} />
        )}
      </div>
    </div>
  );
}
