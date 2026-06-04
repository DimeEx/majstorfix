"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { StepGeneralInfo } from "./step-general-info";
import { StepPropertyTraits } from "./step-property-traits";
import { StepLogistics } from "./step-logistics";
import { Check, Loader2 } from "lucide-react";
import { fullJobSchema, type FullJobInput } from "@/lib/validations/job-schema";
import { createClient } from "@/lib/supabase/client";

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
      const supabase = createClient();
      const { data: userData, error: userError } = await supabase.auth.getUser();

      if (userError || !userData?.user) {
        setSubmitError("Мора да бидете најавени за да објавите работа.");
        setIsSubmitting(false);
        return;
      }

      const { error } = await (supabase.from("jobs") as any).insert({
        description: parsed.data.description,
        city: parsed.data.city,
        neighborhood: parsed.data.neighborhood,
        property_type: parsed.data.property_type,
        floor: parsed.data.floor ?? null,
        has_elevator: parsed.data.has_elevator ?? false,
        is_occupied: parsed.data.is_occupied,
        material_status: parsed.data.material_status,
        urgency: parsed.data.urgency,
        urgency_custom: parsed.data.urgency_custom ?? null,
        completion_time: parsed.data.completion_time,
        completion_time_custom: parsed.data.completion_time_custom ?? null,
        active_days: parsed.data.active_days,
        currency: parsed.data.currency,
        budget_min: parsed.data.budget_min,
        budget_max: parsed.data.budget_max,
        image_urls: parsed.data.images ?? [],
        owner_id: userData.user.id,
      });

      if (error) {
        setSubmitError(error.message);
        return;
      }

      router.push("/jobs");
      router.refresh();
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
        {isSubmitting && (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Објавување на работата...</p>
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
          <p className="mt-4 text-sm text-destructive text-center">{submitError}</p>
        )}
      </div>
    </div>
  );
}
