"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { stepPropertyTraitsSchema, type StepPropertyTraits } from "@/lib/validations/job-schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Field, FieldLabel, FieldContent, FieldError, FieldGroup } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { Building2, Home, ArrowUpDown, ArrowLeftRight, User } from "lucide-react";

interface StepPropertyTraitsProps {
  onNext: (data: StepPropertyTraits) => void;
  onBack: () => void;
}

export function StepPropertyTraits({ onNext, onBack }: StepPropertyTraitsProps) {
  const {
    register,
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<StepPropertyTraits>({
    resolver: zodResolver(stepPropertyTraitsSchema),
    defaultValues: {
      property_type: "house",
      has_elevator: false,
      is_occupied: true,
    },
    mode: "onBlur",
  });

  const propertyType = watch("property_type");

  const onSubmit = (data: StepPropertyTraits) => {
    onNext(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Field>
        <FieldLabel className="flex items-center gap-2 text-sm">
          <Building2 className="h-4 w-4 text-primary" />
          Тип на имот
        </FieldLabel>
        <FieldContent>
          <RadioGroup
            defaultValue="house"
            onValueChange={(val) => setValue("property_type", val as "house" | "apartment")}
            className="flex gap-3"
          >
            <div className="flex-1">
              <RadioGroupItem value="house" id="house" className="peer sr-only" />
              <Label
                htmlFor="house"
                className="flex flex-col items-center gap-2 rounded-xl border-2 border-border/50 p-4 cursor-pointer transition-all peer-data-checked:border-primary peer-data-checked:bg-primary/5 hover:border-primary/50"
              >
                <Home className="h-6 w-6 text-primary" />
                <span className="text-sm font-medium">Куќа</span>
              </Label>
            </div>
            <div className="flex-1">
              <RadioGroupItem value="apartment" id="apartment" className="peer sr-only" />
              <Label
                htmlFor="apartment"
                className="flex flex-col items-center gap-2 rounded-xl border-2 border-border/50 p-4 cursor-pointer transition-all peer-data-checked:border-primary peer-data-checked:bg-primary/5 hover:border-primary/50"
              >
                <Building2 className="h-6 w-6 text-primary" />
                <span className="text-sm font-medium">Стан</span>
              </Label>
            </div>
          </RadioGroup>
          <FieldError errors={errors.property_type ? [errors.property_type] : undefined} />
        </FieldContent>
      </Field>

      {propertyType === "apartment" && (
        <div className="rounded-xl bg-muted/50 p-4 space-y-4 animate-in slide-in-from-top-2 duration-300">
          <FieldGroup>
            <Field>
              <FieldLabel className="flex items-center gap-2 text-sm">
                <ArrowUpDown className="h-4 w-4 text-primary" />
                Кат
              </FieldLabel>
              <FieldContent>
                <Input type="number" min={0} placeholder="Пр. 3" {...register("floor")} />
                <FieldError errors={errors.floor ? [errors.floor] : undefined} />
              </FieldContent>
            </Field>

            <Field orientation="horizontal">
              <FieldLabel className="flex items-center gap-2 text-sm">
                <ArrowLeftRight className="h-4 w-4 text-primary" />
                Има лифт?
              </FieldLabel>
              <FieldContent>
                <Switch
                  onCheckedChange={(checked) => setValue("has_elevator", checked)}
                />
                <FieldError errors={errors.has_elevator ? [errors.has_elevator] : undefined} />
              </FieldContent>
            </Field>
          </FieldGroup>
        </div>
      )}

      <Field>
        <FieldLabel className="flex items-center gap-2 text-sm">
          <User className="h-4 w-4 text-primary" />
          Статус на имотот
        </FieldLabel>
        <FieldContent>
          <RadioGroup
            defaultValue="true"
            onValueChange={(val) => setValue("is_occupied", val === "true")}
            className="flex gap-3"
          >
            <div className="flex-1">
              <RadioGroupItem value="true" id="occupied" className="peer sr-only" />
              <Label
                htmlFor="occupied"
                className="flex flex-col items-center gap-1.5 rounded-xl border-2 border-border/50 p-3.5 cursor-pointer transition-all peer-data-checked:border-primary peer-data-checked:bg-primary/5 hover:border-primary/50"
              >
                <span className="text-sm font-medium">Населен е</span>
                <span className="text-xs text-muted-foreground">мајсторот работи со вас дома</span>
              </Label>
            </div>
            <div className="flex-1">
              <RadioGroupItem value="false" id="empty" className="peer sr-only" />
              <Label
                htmlFor="empty"
                className="flex flex-col items-center gap-1.5 rounded-xl border-2 border-border/50 p-3.5 cursor-pointer transition-all peer-data-checked:border-primary peer-data-checked:bg-primary/5 hover:border-primary/50"
              >
                <span className="text-sm font-medium">Празен / изнајмен</span>
                <span className="text-xs text-muted-foreground">нема потреба од надзор</span>
              </Label>
            </div>
          </RadioGroup>
          <FieldError errors={errors.is_occupied ? [errors.is_occupied] : undefined} />
        </FieldContent>
      </Field>

      <div className="flex gap-4 pt-2">
        <Button type="button" variant="outline" onClick={onBack} className="flex-1 h-11 text-base">
          Назад
        </Button>
        <Button type="submit" className="flex-1 h-11 text-base font-medium">
          Продолжи
        </Button>
      </div>
    </form>
  );
}
