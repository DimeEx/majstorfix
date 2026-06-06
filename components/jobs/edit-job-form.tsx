"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Loader2,
  X,
  Image as ImageIcon,
  MapPin,
  Home,
  FileText,
  Building2,
  ArrowUpDown,
  ArrowLeftRight,
  User,
  Package,
  Timer,
  Clock,
  CalendarDays,
  Wallet,
  Wrench,
} from "lucide-react";
import { toast } from "sonner";
import { fullJobSchema, type FullJobInput } from "@/lib/validations/job-schema";
import { MACEDONIAN_CITIES } from "@/lib/constants";
import { uploadJobImages } from "@/lib/supabase/storage";
import { updateJob } from "@/lib/actions/update-job";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
  FieldGroup,
} from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import type { Job } from "@/lib/supabase/types";

interface EditJobFormProps {
  job: Job;
}

export function EditJobForm({ job }: EditJobFormProps) {
  const router = useRouter();
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>(
    job.image_urls,
  );
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FullJobInput>({
    resolver: zodResolver(fullJobSchema),
    defaultValues: {
      city: job.city,
      neighborhood: job.neighborhood,
      description: job.description,
      trade_type: job.trade_type,
      images: job.image_urls,
      property_type: job.property_type,
      floor: job.floor ?? undefined,
      has_elevator: job.has_elevator,
      is_occupied: job.is_occupied,
      material_status: job.material_status,
      urgency: job.urgency,
      urgency_custom: job.urgency_custom ?? undefined,
      completion_time: job.completion_time,
      completion_time_custom: job.completion_time_custom ?? undefined,
      active_days: job.active_days,
      currency: job.currency,
      budget_min: job.budget_min,
      budget_max: job.budget_max,
    },
    mode: "onChange",
  });

  const propertyType = watch("property_type");
  const completionTime = watch("completion_time");
  const urgency = watch("urgency");
  const selectedTradeType = watch("trade_type");

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
  const selectedTradeLabel =
    tradeOptions.find((t) => t.value === selectedTradeType)?.label ?? null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files ?? []);
    setNewFiles((prev) =>
      [...prev, ...selected].slice(0, Math.max(0, 5 - existingImages.length)),
    );
    e.target.value = "";
  };

  const removeNewFile = (index: number) => {
    setNewFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index: number) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: FullJobInput) => {
    setSubmitting(true);
    try {
      let allImages = [...existingImages];

      if (newFiles.length > 0) {
        const newUrls = await uploadJobImages(newFiles, job.id);
        allImages = [...allImages, ...newUrls];
      }

      const result = await updateJob(job.id, { ...data, images: allImages });

      if (result?.error) {
        toast.error(result.error);
        return;
      }

      toast.success("Работата е успешно ажурирана.");
      router.push(`/jobs/${job.id}`);
    } catch {
      toast.error("Настана грешка при ажурирање.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <Field>
        <FieldLabel className="flex items-center gap-2 text-sm">
          <Wrench className="text-primary h-4 w-4" />
          Категорија
        </FieldLabel>
        <FieldContent>
          <Select
            defaultValue={job.trade_type}
            onValueChange={(val) =>
              setValue("trade_type", val as FullJobInput["trade_type"])
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
              defaultValue={job.city}
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
            placeholder="Опишете го проблемот детално..."
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
            {existingImages.map((url, i) => (
              <div key={`existing-${i}`} className="group relative">
                <div className="border-border bg-muted/50 text-muted-foreground flex h-16 w-16 items-center justify-center overflow-hidden rounded-lg border text-xs">
                  <img
                    src={url}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeExistingImage(i)}
                  className="bg-destructive text-destructive-foreground absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full shadow-sm"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
            {newFiles.map((file, i) => (
              <div key={`new-${i}`} className="group relative">
                <div className="border-border bg-muted/50 text-muted-foreground flex h-16 w-16 items-center justify-center overflow-hidden rounded-lg border text-xs">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeNewFile(i)}
                  className="bg-destructive text-destructive-foreground absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full shadow-sm"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
            {existingImages.length + newFiles.length < 5 && (
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
            Додајте до 5 слики. Кликнете на X за да отстраните постоечка слика.
          </p>
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel className="flex items-center gap-2 text-sm">
          <Building2 className="text-primary h-4 w-4" />
          Тип на имот
        </FieldLabel>
        <FieldContent>
          <RadioGroup
            defaultValue={job.property_type}
            onValueChange={(val) =>
              setValue("property_type", val as "house" | "apartment")
            }
            className="flex gap-3"
          >
            <div className="flex-1">
              <RadioGroupItem
                value="house"
                id="edit-house"
                className="peer sr-only"
              />
              <Label
                htmlFor="edit-house"
                className="border-border/50 peer-data-checked:border-primary peer-data-checked:bg-primary/5 hover:border-primary/50 flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all"
              >
                <Home className="text-primary h-6 w-6" />
                <span className="text-sm font-medium">Куќа</span>
              </Label>
            </div>
            <div className="flex-1">
              <RadioGroupItem
                value="apartment"
                id="edit-apartment"
                className="peer sr-only"
              />
              <Label
                htmlFor="edit-apartment"
                className="border-border/50 peer-data-checked:border-primary peer-data-checked:bg-primary/5 hover:border-primary/50 flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all"
              >
                <Building2 className="text-primary h-6 w-6" />
                <span className="text-sm font-medium">Стан</span>
              </Label>
            </div>
          </RadioGroup>
          <FieldError
            errors={errors.property_type ? [errors.property_type] : undefined}
          />
        </FieldContent>
      </Field>

      {propertyType === "apartment" && (
        <div className="bg-muted/50 animate-in slide-in-from-top-2 space-y-4 rounded-xl p-4 duration-300">
          <FieldGroup>
            <Field>
              <FieldLabel className="flex items-center gap-2 text-sm">
                <ArrowUpDown className="text-primary h-4 w-4" />
                Кат
              </FieldLabel>
              <FieldContent>
                <Input
                  type="number"
                  min={0}
                  placeholder="Пр. 3"
                  {...register("floor")}
                />
                <FieldError
                  errors={errors.floor ? [errors.floor] : undefined}
                />
              </FieldContent>
            </Field>

            <Field orientation="horizontal">
              <FieldLabel className="flex items-center gap-2 text-sm">
                <ArrowLeftRight className="text-primary h-4 w-4" />
                Има лифт?
              </FieldLabel>
              <FieldContent>
                <Switch
                  defaultChecked={job.has_elevator}
                  onCheckedChange={(checked) =>
                    setValue("has_elevator", checked)
                  }
                />
                <FieldError
                  errors={
                    errors.has_elevator ? [errors.has_elevator] : undefined
                  }
                />
              </FieldContent>
            </Field>
          </FieldGroup>
        </div>
      )}

      <Field>
        <FieldLabel className="flex items-center gap-2 text-sm">
          <User className="text-primary h-4 w-4" />
          Статус на имотот
        </FieldLabel>
        <FieldContent>
          <RadioGroup
            defaultValue={String(job.is_occupied)}
            onValueChange={(val) => setValue("is_occupied", val === "true")}
            className="flex gap-3"
          >
            <div className="flex-1">
              <RadioGroupItem
                value="true"
                id="edit-occupied"
                className="peer sr-only"
              />
              <Label
                htmlFor="edit-occupied"
                className="border-border/50 peer-data-checked:border-primary peer-data-checked:bg-primary/5 hover:border-primary/50 flex cursor-pointer flex-col items-center gap-1.5 rounded-xl border-2 p-3.5 transition-all"
              >
                <span className="text-sm font-medium">Населен е</span>
                <span className="text-muted-foreground text-xs">
                  мајсторот работи со вас дома
                </span>
              </Label>
            </div>
            <div className="flex-1">
              <RadioGroupItem
                value="false"
                id="edit-empty"
                className="peer sr-only"
              />
              <Label
                htmlFor="edit-empty"
                className="border-border/50 peer-data-checked:border-primary peer-data-checked:bg-primary/5 hover:border-primary/50 flex cursor-pointer flex-col items-center gap-1.5 rounded-xl border-2 p-3.5 transition-all"
              >
                <span className="text-sm font-medium">Празен / изнајмен</span>
                <span className="text-muted-foreground text-xs">
                  нема потреба од надзор
                </span>
              </Label>
            </div>
          </RadioGroup>
          <FieldError
            errors={errors.is_occupied ? [errors.is_occupied] : undefined}
          />
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel className="flex items-center gap-2 text-sm">
          <Package className="text-primary h-4 w-4" />
          Материјали
        </FieldLabel>
        <FieldContent>
          <RadioGroup
            defaultValue={job.material_status}
            onValueChange={(val) =>
              setValue(
                "material_status",
                val as "buyer_provides" | "handyman_provides" | "negotiable",
              )
            }
            className="flex flex-col gap-2"
          >
            <div className="border-border/50 has-data-checked:border-primary has-data-checked:bg-primary/5 flex items-center gap-3 rounded-lg border-2 px-4 py-3 transition-all">
              <RadioGroupItem value="buyer_provides" id="edit-buyer" />
              <Label htmlFor="edit-buyer" className="font-medium">
                Јас ќе ги обезбедам материјалите
              </Label>
            </div>
            <div className="border-border/50 has-data-checked:border-primary has-data-checked:bg-primary/5 flex items-center gap-3 rounded-lg border-2 px-4 py-3 transition-all">
              <RadioGroupItem value="handyman_provides" id="edit-handyman" />
              <Label htmlFor="edit-handyman" className="font-medium">
                Мајсторот да обезбеди материјали
              </Label>
            </div>
            <div className="border-border/50 has-data-checked:border-primary has-data-checked:bg-primary/5 flex items-center gap-3 rounded-lg border-2 px-4 py-3 transition-all">
              <RadioGroupItem value="negotiable" id="edit-negotiable" />
              <Label htmlFor="edit-negotiable" className="font-medium">
                Се договара
              </Label>
            </div>
          </RadioGroup>
          <FieldError
            errors={
              errors.material_status ? [errors.material_status] : undefined
            }
          />
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel className="flex items-center gap-2 text-sm">
          <Timer className="text-primary h-4 w-4" />
          Итност
        </FieldLabel>
        <FieldContent>
          <Select
            defaultValue={job.urgency}
            onValueChange={(val) =>
              setValue(
                "urgency",
                val as "emergency" | "few_days" | "flexible" | "custom",
              )
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Изберете итност" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="emergency">Итно (Денес)</SelectItem>
              <SelectItem value="few_days">Во рок од 2-3 дена</SelectItem>
              <SelectItem value="flexible">Флексибилно</SelectItem>
              <SelectItem value="custom">Прилагодено</SelectItem>
            </SelectContent>
          </Select>
          {urgency === "custom" && (
            <div className="animate-in slide-in-from-top-2 mt-3 duration-200">
              <Input
                placeholder="Пр. Во рок од 1 недела, до 15ти, итн..."
                {...register("urgency_custom")}
              />
            </div>
          )}
          <FieldError errors={errors.urgency ? [errors.urgency] : undefined} />
          <FieldError
            errors={errors.urgency_custom ? [errors.urgency_custom] : undefined}
          />
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel className="flex items-center gap-2 text-sm">
          <Clock className="text-primary h-4 w-4" />
          Време за изработка
        </FieldLabel>
        <FieldContent>
          <RadioGroup
            defaultValue={job.completion_time}
            onValueChange={(val) =>
              setValue(
                "completion_time",
                val as
                  | "1-2_hours"
                  | "3-4_hours"
                  | "5-8_hours"
                  | "1-2_days"
                  | "3+_days"
                  | "custom",
              )
            }
            className="grid grid-cols-2 gap-2 sm:grid-cols-3"
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
                <RadioGroupItem
                  value={opt.value}
                  id={`edit-${opt.value}`}
                  className="peer sr-only"
                />
                <Label
                  htmlFor={`edit-${opt.value}`}
                  className="border-border/50 peer-data-checked:border-primary peer-data-checked:bg-primary/5 peer-data-checked:text-primary hover:border-primary/50 flex cursor-pointer items-center justify-center rounded-lg border-2 px-3 py-2.5 text-sm font-medium transition-all"
                >
                  {opt.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
          {completionTime === "custom" && (
            <div className="animate-in slide-in-from-top-2 mt-3 duration-200">
              <Input
                placeholder="Пр. 2-3 дена, 2 часа, итн..."
                {...register("completion_time_custom")}
              />
            </div>
          )}
          <FieldError
            errors={
              errors.completion_time ? [errors.completion_time] : undefined
            }
          />
          <FieldError
            errors={
              errors.completion_time_custom
                ? [errors.completion_time_custom]
                : undefined
            }
          />
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel className="flex items-center gap-2 text-sm">
          <CalendarDays className="text-primary h-4 w-4" />
          Времетраење на огласот
        </FieldLabel>
        <FieldContent>
          <Select
            defaultValue={String(job.active_days)}
            onValueChange={(val) => setValue("active_days", Number(val))}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Изберете времетраење" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">24 часа</SelectItem>
              <SelectItem value="3">3 дена</SelectItem>
              <SelectItem value="7">7 дена</SelectItem>
            </SelectContent>
          </Select>
          <FieldError
            errors={errors.active_days ? [errors.active_days] : undefined}
          />
        </FieldContent>
      </Field>

      <FieldGroup>
        <FieldLabel className="mb-1 flex items-center gap-2 text-sm">
          <Wallet className="text-primary h-4 w-4" />
          Буџет
        </FieldLabel>
        <div className="flex items-start gap-2">
          <div className="flex-1">
            <Field>
              <FieldContent>
                <Input
                  type="number"
                  min={1}
                  placeholder="Од"
                  {...register("budget_min")}
                />
                <FieldError
                  errors={errors.budget_min ? [errors.budget_min] : undefined}
                />
              </FieldContent>
            </Field>
          </div>
          <div className="flex-1">
            <Field>
              <FieldContent>
                <Input
                  type="number"
                  min={1}
                  placeholder="До"
                  {...register("budget_max")}
                />
                <FieldError
                  errors={errors.budget_max ? [errors.budget_max] : undefined}
                />
              </FieldContent>
            </Field>
          </div>
          <div className="w-24 shrink-0">
            <Field>
              <FieldContent>
                <Select
                  defaultValue={job.currency}
                  onValueChange={(val) =>
                    setValue("currency", val as "MKD" | "EUR")
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MKD">MKD</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                  </SelectContent>
                </Select>
                <FieldError
                  errors={errors.currency ? [errors.currency] : undefined}
                />
              </FieldContent>
            </Field>
          </div>
        </div>
      </FieldGroup>

      <div className="flex gap-4 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          className="h-11 flex-1 text-base"
        >
          Откажи
        </Button>
        <Button
          type="submit"
          disabled={submitting}
          className="h-11 flex-1 text-base font-medium"
        >
          {submitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Зачувување...
            </>
          ) : (
            "Зачувај промени"
          )}
        </Button>
      </div>
    </form>
  );
}
