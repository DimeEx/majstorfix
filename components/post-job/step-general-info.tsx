"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { stepGeneralInfoSchema } from "@/lib/validations/job-schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldLabel, FieldContent, FieldError } from "@/components/ui/field";
import { MapPin, Home, FileText, Image } from "lucide-react";

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
      <div className="grid gap-6 sm:grid-cols-2">
        <Field>
          <FieldLabel className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-primary" />
            Град
          </FieldLabel>
          <FieldContent>
            <Input placeholder="Пр. Скопје, Битола, Охрид" {...register("city")} />
            <FieldError errors={errors.city ? [errors.city] : undefined} />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel className="flex items-center gap-2 text-sm">
            <Home className="h-4 w-4 text-primary" />
            Населба / Општина
          </FieldLabel>
          <FieldContent>
            <Input placeholder="Пр. Аеродром, Центар, Тафталиџе" {...register("neighborhood")} />
            <FieldError errors={errors.neighborhood ? [errors.neighborhood] : undefined} />
          </FieldContent>
        </Field>
      </div>

      <Field>
        <FieldLabel className="flex items-center gap-2 text-sm">
          <FileText className="h-4 w-4 text-primary" />
          Опис на проблемот
        </FieldLabel>
        <FieldContent>
          <Textarea
            placeholder="Опишете го проблемот детално... Каде се наоѓа? Од кога трае? Што сте пробале досега?"
            rows={5}
            {...register("description")}
          />
          <FieldError errors={errors.description ? [errors.description] : undefined} />
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel className="flex items-center gap-2 text-sm">
          <Image className="h-4 w-4 text-primary" />
          Слики од проблемот
        </FieldLabel>
        <FieldContent>
          <div className="relative">
            <Input type="file" multiple accept="image/*" className="pt-1.5" />
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Додајте слики за да добиете попрецизни понуди
          </p>
        </FieldContent>
      </Field>

      <div className="pt-2">
        <Button type="submit" disabled={!isValid} className="w-full h-11 text-base font-medium">
          Продолжи
        </Button>
      </div>
    </form>
  );
}
