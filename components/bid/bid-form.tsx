"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { bidSchema } from "@/lib/validations/bid-schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldLabel, FieldContent, FieldError, FieldGroup } from "@/components/ui/field";
import { createBid } from "@/lib/actions/create-bid";

interface BidFormProps {
  jobId: string;
}

export function BidForm({ jobId }: BidFormProps) {
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<z.output<typeof bidSchema>>({
    resolver: zodResolver(bidSchema),
    mode: "onBlur",
  });

  const onSubmit = async (data: z.output<typeof bidSchema>) => {
    setSubmitting(true);
    try {
      const result = await createBid({
        jobId,
        handyman_phone: data.handyman_phone,
        price_labor_only: data.price_labor_only,
        price_with_materials: data.price_with_materials ?? null,
        availability_date: data.availability_date,
        notes: data.notes ?? null,
      });

      if (result?.error) {
        toast.error(result.error);
        return;
      }

      toast.success("Вашата понуда е испратена!");
      reset();
    } catch {
      toast.error("Настана грешка. Обидете се повторно.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Понуда за работа</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <FieldGroup>
            <Field>
              <FieldLabel>Цена само за работа (MKD)</FieldLabel>
              <FieldContent>
                <Input type="number" min={1} placeholder="Пр. 3000" {...register("price_labor_only")} />
                <FieldError errors={errors.price_labor_only ? [errors.price_labor_only] : undefined} />
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel>Цена со материјали (MKD)</FieldLabel>
              <FieldContent>
                <Input type="number" min={1} placeholder="Пр. 5000 (опционално)" {...register("price_with_materials")} />
                <FieldError errors={errors.price_with_materials ? [errors.price_with_materials] : undefined} />
              </FieldContent>
            </Field>
          </FieldGroup>

          <Field>
            <FieldLabel>Телефон</FieldLabel>
            <FieldContent>
              <Input placeholder="+38970123456" {...register("handyman_phone")} />
              <FieldError errors={errors.handyman_phone ? [errors.handyman_phone] : undefined} />
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel>Датум на достапност</FieldLabel>
            <FieldContent>
              <Input type="date" {...register("availability_date")} />
              <FieldError errors={errors.availability_date ? [errors.availability_date] : undefined} />
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel>Забелешка (опционално)</FieldLabel>
            <FieldContent>
              <Textarea placeholder="Пр. Можам да дојдам само претпладне" {...register("notes")} />
              <FieldError errors={errors.notes ? [errors.notes] : undefined} />
            </FieldContent>
          </Field>

          <Button type="submit" disabled={!isValid || submitting} className="w-full">
            {submitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Испраќање...
              </>
            ) : (
              "Испрати понуда"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
