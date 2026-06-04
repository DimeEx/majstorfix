"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { stepPropertyTraitsSchema } from "@/lib/validations/job-schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Field, FieldLabel, FieldContent, FieldError, FieldGroup } from "@/components/ui/field";

interface StepPropertyTraitsProps {
  onNext: () => void;
  onBack: () => void;
}

export function StepPropertyTraits({ onNext, onBack }: StepPropertyTraitsProps) {
  const {
    register,
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<z.output<typeof stepPropertyTraitsSchema>>({
    resolver: zodResolver(stepPropertyTraitsSchema),
    defaultValues: {
      property_type: "house",
      has_elevator: false,
      is_occupied: true,
    },
    mode: "onBlur",
  });

  const propertyType = watch("property_type");

  const onSubmit = () => {
    onNext();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Field>
        <FieldLabel>Тип на имот</FieldLabel>
        <FieldContent>
          <RadioGroup
            defaultValue="house"
            onValueChange={(val) => setValue("property_type", val as "house" | "apartment")}
            className="flex gap-4"
          >
            <div className="flex items-center gap-2">
              <RadioGroupItem value="house" id="house" />
              <label htmlFor="house">Куќа</label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="apartment" id="apartment" />
              <label htmlFor="apartment">Стан</label>
            </div>
          </RadioGroup>
          <FieldError errors={errors.property_type ? [errors.property_type] : undefined} />
        </FieldContent>
      </Field>

      {propertyType === "apartment" && (
        <FieldGroup>
          <Field>
            <FieldLabel>Кат</FieldLabel>
            <FieldContent>
              <Input type="number" min={0} placeholder="Пр. 3" {...register("floor")} />
              <FieldError errors={errors.floor ? [errors.floor] : undefined} />
            </FieldContent>
          </Field>

          <Field orientation="horizontal">
            <FieldLabel>Има лифт?</FieldLabel>
            <FieldContent>
              <Switch
                onCheckedChange={(checked) => setValue("has_elevator", checked)}
              />
              <FieldError errors={errors.has_elevator ? [errors.has_elevator] : undefined} />
            </FieldContent>
          </Field>
        </FieldGroup>
      )}

      <Field orientation="horizontal">
        <FieldLabel>Статус на имотот</FieldLabel>
        <FieldContent>
          <RadioGroup
            defaultValue="true"
            onValueChange={(val) => setValue("is_occupied", val === "true")}
            className="flex gap-4"
          >
            <div className="flex items-center gap-2">
              <RadioGroupItem value="true" id="occupied" />
              <label htmlFor="occupied">Населен е</label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="false" id="empty" />
              <label htmlFor="empty">Празен / изнајмен</label>
            </div>
          </RadioGroup>
          <FieldError errors={errors.is_occupied ? [errors.is_occupied] : undefined} />
        </FieldContent>
      </Field>

      <div className="flex gap-4">
        <Button type="button" variant="outline" onClick={onBack} className="flex-1">
          Назад
        </Button>
        <Button type="submit" className="flex-1">
          Продолжи
        </Button>
      </div>
    </form>
  );
}
