"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { stepLogisticsSchema } from "@/lib/validations/job-schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Field, FieldLabel, FieldContent, FieldError, FieldGroup } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { Package, Timer, CalendarDays, Wallet, Clock } from "lucide-react";

interface StepLogisticsProps {
  onBack: () => void;
}

export function StepLogistics({ onBack }: StepLogisticsProps) {
  const {
    register,
    setValue,
    watch,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<z.output<typeof stepLogisticsSchema>>({
    resolver: zodResolver(stepLogisticsSchema),
    defaultValues: {
      material_status: "negotiable",
      completion_time: "1-2_hours",
      active_days: 3,
    },
    mode: "onBlur",
  });

  const completionTime = watch("completion_time");

  const onSubmit = () => {
    // TODO: Submit full form data to Supabase
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Field>
        <FieldLabel className="flex items-center gap-2 text-sm">
          <Package className="h-4 w-4 text-primary" />
          Материјали
        </FieldLabel>
        <FieldContent>
          <RadioGroup
            defaultValue="negotiable"
            onValueChange={(val) => setValue("material_status", val as "buyer_provides" | "handyman_provides" | "negotiable")}
            className="flex flex-col gap-2"
          >
            <div className="flex items-center gap-3 rounded-lg border-2 border-border/50 px-4 py-3 transition-all has-data-checked:border-primary has-data-checked:bg-primary/5">
              <RadioGroupItem value="buyer_provides" id="buyer" />
              <Label htmlFor="buyer" className="font-medium">Јас ќе ги обезбедам материјалите</Label>
            </div>
            <div className="flex items-center gap-3 rounded-lg border-2 border-border/50 px-4 py-3 transition-all has-data-checked:border-primary has-data-checked:bg-primary/5">
              <RadioGroupItem value="handyman_provides" id="handyman" />
              <Label htmlFor="handyman" className="font-medium">Мајсторот да обезбеди материјали</Label>
            </div>
            <div className="flex items-center gap-3 rounded-lg border-2 border-border/50 px-4 py-3 transition-all has-data-checked:border-primary has-data-checked:bg-primary/5">
              <RadioGroupItem value="negotiable" id="negotiable" />
              <Label htmlFor="negotiable" className="font-medium">Се договара</Label>
            </div>
          </RadioGroup>
          <FieldError errors={errors.material_status ? [errors.material_status] : undefined} />
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel className="flex items-center gap-2 text-sm">
          <Timer className="h-4 w-4 text-primary" />
          Итност
        </FieldLabel>
        <FieldContent>
          <Select onValueChange={(val) => setValue("urgency", val as "emergency" | "few_days" | "flexible")}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Изберете итност" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="emergency">Итно (Денес)</SelectItem>
              <SelectItem value="few_days">Во рок од 2-3 дена</SelectItem>
              <SelectItem value="flexible">Флексибилно</SelectItem>
            </SelectContent>
          </Select>
          <FieldError errors={errors.urgency ? [errors.urgency] : undefined} />
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel className="flex items-center gap-2 text-sm">
          <Clock className="h-4 w-4 text-primary" />
          Време за изработка
        </FieldLabel>
        <FieldContent>
          <RadioGroup
            defaultValue="1-2_hours"
            onValueChange={(val) => setValue("completion_time", val as "1-2_hours" | "3-4_hours" | "5-8_hours" | "1-2_days" | "3+_days" | "custom")}
            className="grid grid-cols-2 sm:grid-cols-3 gap-2"
          >
            {[
              { value: "1-2_hours", label: "1-2 часа" },
              { value: "3-4_hours", label: "3-4 часа" },
              { value: "5-8_hours", label: "5-8 часа" },
              { value: "1-2_days", label: "1-2 дена" },
              { value: "3+_days", label: "3+ дена" },
              { value: "custom", label: "Прилагодено" },
            ].map((opt) => (
              <div key={opt.value}>
                <RadioGroupItem value={opt.value} id={opt.value} className="peer sr-only" />
                <Label
                  htmlFor={opt.value}
                  className="flex items-center justify-center rounded-lg border-2 border-border/50 px-3 py-2.5 text-sm font-medium cursor-pointer transition-all peer-data-checked:border-primary peer-data-checked:bg-primary/5 peer-data-checked:text-primary hover:border-primary/50"
                >
                  {opt.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
          {completionTime === "custom" && (
            <div className="mt-3 animate-in slide-in-from-top-2 duration-200">
              <Input placeholder="Пр. 2-3 дена, 2 часа, итн..." {...register("completion_time_custom")} />
            </div>
          )}
          <FieldError errors={errors.completion_time ? [errors.completion_time] : undefined} />
          <FieldError errors={errors.completion_time_custom ? [errors.completion_time_custom] : undefined} />
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel className="flex items-center gap-2 text-sm">
          <CalendarDays className="h-4 w-4 text-primary" />
          Времетраење на огласот
        </FieldLabel>
        <FieldContent>
          <Select onValueChange={(val) => setValue("active_days", Number(val))}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Изберете времетраење" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">24 часа</SelectItem>
              <SelectItem value="3">3 дена</SelectItem>
              <SelectItem value="7">7 дена</SelectItem>
            </SelectContent>
          </Select>
          <FieldError errors={errors.active_days ? [errors.active_days] : undefined} />
        </FieldContent>
      </Field>

      <FieldGroup>
        <FieldLabel className="flex items-center gap-2 text-sm mb-1">
          <Wallet className="h-4 w-4 text-primary" />
          Буџет (MKD)
        </FieldLabel>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field>
            <FieldContent>
              <Input type="number" min={1} placeholder="Од" {...register("budget_min")} />
              <FieldError errors={errors.budget_min ? [errors.budget_min] : undefined} />
            </FieldContent>
          </Field>
          <Field>
            <FieldContent>
              <Input type="number" min={1} placeholder="До" {...register("budget_max")} />
              <FieldError errors={errors.budget_max ? [errors.budget_max] : undefined} />
            </FieldContent>
          </Field>
        </div>
      </FieldGroup>

      <div className="flex gap-4 pt-2">
        <Button type="button" variant="outline" onClick={onBack} className="flex-1 h-11 text-base">
          Назад
        </Button>
        <Button type="submit" disabled={!isValid} className="flex-1 h-11 text-base font-medium">
          Објави
        </Button>
      </div>
    </form>
  );
}
