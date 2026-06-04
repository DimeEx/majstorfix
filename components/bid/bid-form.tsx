"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { bidSchema } from "@/lib/validations/bid-schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldLabel, FieldContent, FieldError, FieldGroup } from "@/components/ui/field";

interface BidFormProps {
  jobId: string;
}

export function BidForm({ jobId }: BidFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<z.output<typeof bidSchema>>({
    resolver: zodResolver(bidSchema),
    mode: "onBlur",
  });

  const onSubmit = (data: z.output<typeof bidSchema>) => {
    // TODO: Submit bid to Supabase
    console.log({ jobId, ...data });
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

          <Button type="submit" disabled={!isValid} className="w-full">
            Испрати понуда
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
