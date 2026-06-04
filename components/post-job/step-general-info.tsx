"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { stepGeneralInfoSchema } from "@/lib/validations/job-schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldLabel, FieldContent, FieldError } from "@/components/ui/field";

interface StepGeneralInfoProps {
  onNext: () => void;
}

export function StepGeneralInfo({ onNext }: StepGeneralInfoProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<z.output<typeof stepGeneralInfoSchema>>({
    resolver: zodResolver(stepGeneralInfoSchema),
    mode: "onBlur",
  });

  const onSubmit = () => {
    onNext();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Field>
        <FieldLabel>Град</FieldLabel>
        <FieldContent>
          <Input placeholder="Пр. Скопје, Битола, Охрид" {...register("city")} />
          <FieldError errors={errors.city ? [errors.city] : undefined} />
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel>Населба / Општина</FieldLabel>
        <FieldContent>
          <Input placeholder="Пр. Аеродром, Центар, Тафталиџе" {...register("neighborhood")} />
          <FieldError errors={errors.neighborhood ? [errors.neighborhood] : undefined} />
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel>Опис на проблемот</FieldLabel>
        <FieldContent>
          <Textarea
            placeholder="Опишете го проблемот детално..."
            rows={4}
            {...register("description")}
          />
          <FieldError errors={errors.description ? [errors.description] : undefined} />
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel>Слики од проблемот (задолжително)</FieldLabel>
        <FieldContent>
          <Input type="file" multiple accept="image/*" />
          <p className="text-xs text-muted-foreground">Додајте барем една слика од проблемот</p>
          <FieldError errors={errors.images ? [errors.images] : undefined} />
        </FieldContent>
      </Field>

      <Button type="submit" disabled={!isValid} className="w-full">
        Продолжи
      </Button>
    </form>
  );
}
