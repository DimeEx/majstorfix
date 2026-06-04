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

interface StepLogisticsProps {
  onBack: () => void;
}

export function StepLogistics({ onBack }: StepLogisticsProps) {
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<z.output<typeof stepLogisticsSchema>>({
    resolver: zodResolver(stepLogisticsSchema),
    defaultValues: {
      active_days: 3,
    },
    mode: "onBlur",
  });

  const onSubmit = () => {
    // TODO: Submit full form data to Supabase
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Field>
        <FieldLabel>Материјали</FieldLabel>
        <FieldContent>
          <RadioGroup
            defaultValue="negotiable"
            onValueChange={(val) => setValue("material_status", val as "buyer_provides" | "handyman_provides" | "negotiable")}
            className="flex flex-col gap-2"
          >
            <div className="flex items-center gap-2">
              <RadioGroupItem value="buyer_provides" id="buyer" />
              <label htmlFor="buyer">Јас ќе ги обезбедам материјалите</label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="handyman_provides" id="handyman" />
              <label htmlFor="handyman">Мајсторот да обезбеди материјали</label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="negotiable" id="negotiable" />
              <label htmlFor="negotiable">Се договара</label>
            </div>
          </RadioGroup>
          <FieldError errors={errors.material_status ? [errors.material_status] : undefined} />
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel>Итност</FieldLabel>
        <FieldContent>
          <Select onValueChange={(val) => setValue("urgency", val as "emergency" | "few_days" | "flexible")}>
            <SelectTrigger>
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
        <FieldLabel>Времетраење на огласот</FieldLabel>
        <FieldContent>
          <Select onValueChange={(val) => setValue("active_days", Number(val))}>
            <SelectTrigger>
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
        <Field>
          <FieldLabel>Минимален буџет (MKD)</FieldLabel>
          <FieldContent>
            <Input type="number" min={1} placeholder="Пр. 1000" {...register("budget_min")} />
            <FieldError errors={errors.budget_min ? [errors.budget_min] : undefined} />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel>Максимален буџет (MKD)</FieldLabel>
          <FieldContent>
            <Input type="number" min={1} placeholder="Пр. 5000" {...register("budget_max")} />
            <FieldError errors={errors.budget_max ? [errors.budget_max] : undefined} />
          </FieldContent>
        </Field>
      </FieldGroup>

      <div className="flex gap-4">
        <Button type="button" variant="outline" onClick={onBack} className="flex-1">
          Назад
        </Button>
        <Button type="submit" disabled={!isValid} className="flex-1">
          Објави
        </Button>
      </div>
    </form>
  );
}
