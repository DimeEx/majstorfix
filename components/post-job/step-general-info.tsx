"use client";

import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Loader2,
  X,
  Image as ImageIcon,
  MapPin,
  Home,
  FileText,
  Wrench,
} from "lucide-react";
import { toast } from "sonner";
import {
  stepGeneralInfoSchema,
  type StepGeneralInfo,
} from "@/lib/validations/job-schema";
import { MACEDONIAN_CITIES } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Field,
  FieldLabel,
  FieldContent,
  FieldError,
} from "@/components/ui/field";
import { uploadJobImages } from "@/lib/supabase/storage";

interface StepGeneralInfoProps {
  onNext: (data: StepGeneralInfo) => void;
}

export function StepGeneralInfo({ onNext }: StepGeneralInfoProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);

  const {
    register,
    setValue,
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<StepGeneralInfo>({
    resolver: zodResolver(stepGeneralInfoSchema),
    defaultValues: { trade_type: "other" },
    mode: "onChange",
  });

  const tradeOptions = [
    { value: "plumbing", label: "Водовод" },
    { value: "electrical", label: "Струја" },
    { value: "painting", label: "Молер / Фарбање" },
    { value: "drywall", label: "Гипсар" },
    { value: "tiling", label: "Плочки" },
    { value: "flooring", label: "Паркет / Подови" },
    { value: "carpentry", label: "Столарија" },
    { value: "hvac", label: "Греење / Клима" },
    { value: "construction", label: "Градежништво" },
    { value: "other", label: "Друго" },
  ];

  const selectedTradeType = useWatch({ control, name: "trade_type" });
  const selectedTradeLabel =
    tradeOptions.find((t) => t.value === selectedTradeType)?.label ?? null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files ?? []);
    setFiles((prev) => [...prev, ...selected].slice(0, 5));
    e.target.value = "";
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: StepGeneralInfo) => {
    setUploading(true);
    try {
      const imageUrls = await uploadJobImages(files);
      onNext({ ...data, images: imageUrls });
    } catch {
      toast.error("Грешка при прикачување на сликите. Обидете се повторно.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Field>
        <FieldLabel className="flex items-center gap-2 text-sm">
          <Wrench className="text-primary h-4 w-4" />
          Категорија
        </FieldLabel>
        <FieldContent>
          <Select
            defaultValue="other"
            onValueChange={(val) =>
              setValue("trade_type", val as StepGeneralInfo["trade_type"])
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Изберете категорија">
                {selectedTradeLabel}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {tradeOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FieldError
            errors={errors.trade_type ? [errors.trade_type] : undefined}
          />
        </FieldContent>
      </Field>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field>
          <FieldLabel className="flex items-center gap-2 text-sm">
            <MapPin className="text-primary h-4 w-4" />
            Град
          </FieldLabel>
          <FieldContent>
            <Select
              onValueChange={(val) =>
                setValue("city", val as string, { shouldValidate: true })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Изберете град" />
              </SelectTrigger>
              <SelectContent side="bottom" className="max-h-[380px]">
                {MACEDONIAN_CITIES.map((city) => (
                  <SelectItem key={city} value={city}>
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FieldError errors={errors.city ? [errors.city] : undefined} />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel className="flex items-center gap-2 text-sm">
            <Home className="text-primary h-4 w-4" />
            Населба / Општина
          </FieldLabel>
          <FieldContent>
            <Input
              placeholder="Пр. Аеродром, Центар, Тафталиџе"
              {...register("neighborhood")}
            />
            <FieldError
              errors={errors.neighborhood ? [errors.neighborhood] : undefined}
            />
          </FieldContent>
        </Field>
      </div>

      <Field>
        <FieldLabel className="flex items-center gap-2 text-sm">
          <FileText className="text-primary h-4 w-4" />
          Опис на проблемот
        </FieldLabel>
        <FieldContent>
          <Textarea
            placeholder="Опишете го проблемот детално... Каде се наоѓа? Од кога трае? Што сте пробале досега?"
            rows={5}
            {...register("description")}
          />
          <FieldError
            errors={errors.description ? [errors.description] : undefined}
          />
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel className="flex items-center gap-2 text-sm">
          <ImageIcon className="text-primary h-4 w-4" />
          Слики од проблемот
        </FieldLabel>
        <FieldContent>
          <div className="mb-2 flex flex-wrap gap-2">
            {files.map((file, i) => (
              <div key={i} className="group relative">
                <div className="border-border bg-muted/50 text-muted-foreground flex h-16 w-16 items-center justify-center overflow-hidden rounded-lg border text-xs">
                  <div
                    role="img"
                    aria-label={file.name}
                    className="h-full w-full bg-cover bg-center"
                    style={{ backgroundImage: `url(${URL.createObjectURL(file)})` }}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeFile(i)}
                  className="bg-destructive text-destructive-foreground absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full shadow-sm"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
            {files.length < 5 && (
              <label className="border-border bg-muted/30 text-muted-foreground hover:bg-muted/50 flex h-16 w-16 cursor-pointer items-center justify-center rounded-lg border border-dashed transition-colors">
                <ImageIcon className="h-5 w-5" />
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
            )}
          </div>
          <p className="text-muted-foreground text-xs">
            Додајте до 5 слики за да добиете попрецизни понуди
          </p>
        </FieldContent>
      </Field>

      <div className="pt-2">
        <Button
          type="submit"
          disabled={!isValid || uploading}
          className="h-11 w-full text-base font-medium"
        >
          {uploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Прикачување слики...
            </>
          ) : (
            "Продолжи"
          )}
        </Button>
      </div>
    </form>
  );
}
