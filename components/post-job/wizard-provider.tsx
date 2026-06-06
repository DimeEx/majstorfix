"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { StepGeneralInfo } from "./step-general-info";
import { StepPropertyTraits } from "./step-property-traits";
import { StepLogistics } from "./step-logistics";
import { Check, Loader2 } from "lucide-react";
import { fullJobSchema, type FullJobInput } from "@/lib/validations/job-schema";
import { createJob } from "@/lib/actions/create-job";

type WizardStep = "general" | "traits" | "logistics";

const steps: { key: WizardStep; label: string; number: number }[] = [
  { key: "general", label: "Општи информации", number: 1 },
  { key: "traits", label: "Карактеристики на имотот", number: 2 },
  { key: "logistics", label: "Логистика и буџет", number: 3 },
];

export function PostJobWizard() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<WizardStep>("general");
  const [wizardData, setWizardData] = useState<Partial<FullJobInput>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const currentIndex = steps.findIndex((s) => s.key === currentStep);

  const saveStepData = <T extends Record<string, unknown>>(data: T) => {
    setWizardData((prev) => ({ ...prev, ...data }));
  };

  const goTo = (step: WizardStep) => setCurrentStep(step);

  const handleNext = <T extends Record<string, unknown>>(data: T) => {
    saveStepData(data);
    const nextIndex = currentIndex + 1;
    if (nextIndex < steps.length) {
      goTo(steps[nextIndex].key);
    }
  };

  const handleSubmit = async (data: Record<string, unknown>) => {
    const merged = { ...wizardData, ...data };
    const parsed = fullJobSchema.safeParse(merged);

    if (!parsed.success) {
      setSubmitError("Проверете ги внесените податоци.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const result = await createJob(parsed.data);

      if (result?.error) {
        setSubmitError(result.error);
        return;
      }

      router.push("/jobs");
    } catch {
      setSubmitError("Настана грешка при објавување. Обидете се повторно.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    const prevIndex = currentIndex - 1;
    if (prevIndex >= 0) {
      goTo(steps[prevIndex].key);
    }
  };

  return (
    <div>
      {/* Step Progress */}
      <div className="relative mb-10">
        <div className="bg-border absolute top-5 right-0 left-0 h-px" />
        <div
          className="bg-primary absolute top-5 left-0 h-px transition-all duration-500 ease-in-out"
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
                      ? "bg-primary text-primary-foreground shadow-primary/25 shadow-lg"
                      : isCurrent
                        ? "bg-primary text-primary-foreground shadow-primary/25 ring-primary/15 shadow-lg ring-4"
                        : "bg-muted text-muted-foreground"
                  }`}
                >
                  {isCompleted ? <Check className="h-4 w-4" /> : step.number}
                </div>
                <span
                  className={`hidden text-xs font-medium transition-colors sm:block ${
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
      <div className="bg-card border-border/50 shadow-border/50 rounded-2xl border p-6 shadow-sm sm:p-8">
        {isSubmitting && (
          <div className="flex flex-col items-center justify-center gap-3 py-16">
            <Loader2 className="text-primary h-8 w-8 animate-spin" />
            <p className="text-muted-foreground text-sm">
              Објавување на работата...
            </p>
          </div>
        )}

        {!isSubmitting && currentStep === "general" && (
          <StepGeneralInfo onNext={handleNext} />
        )}
        {!isSubmitting && currentStep === "traits" && (
          <StepPropertyTraits onNext={handleNext} onBack={handleBack} />
        )}
        {!isSubmitting && currentStep === "logistics" && (
          <StepLogistics onBack={handleBack} onSubmit={handleSubmit} />
        )}

        {submitError && (
          <p className="text-destructive mt-4 text-center text-sm">
            {submitError}
          </p>
        )}
      </div>
    </div>
  );
}
