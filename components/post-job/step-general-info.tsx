"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, X, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { stepGeneralInfoSchema, type StepGeneralInfo } from "@/lib/validations/job-schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldLabel, FieldContent, FieldError } from "@/components/ui/field";
import { MapPin, Home, FileText } from "lucide-react";
import { uploadJobImages } from "@/lib/supabase/storage";

interface StepGeneralInfoProps {
  onNext: (data: StepGeneralInfo) => void;
}

export function StepGeneralInfo({ onNext }: StepGeneralInfoProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<StepGeneralInfo>({
    resolver: zodResolver(stepGeneralInfoSchema),
    mode: "onBlur",
  });

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
          <ImageIcon className="h-4 w-4 text-primary" />
          Слики од проблемот
        </FieldLabel>
        <FieldContent>
          <div className="flex flex-wrap gap-2 mb-2">
            {files.map((file, i) => (
              <div key={i} className="relative group">
                <div className="flex h-16 w-16 items-center justify-center rounded-lg border border-border bg-muted/50 text-xs text-muted-foreground overflow-hidden">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeFile(i)}
                  className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-destructive-foreground shadow-sm"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
            {files.length < 5 && (
              <label className="flex h-16 w-16 cursor-pointer items-center justify-center rounded-lg border border-dashed border-border bg-muted/30 text-muted-foreground hover:bg-muted/50 transition-colors">
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
          <p className="text-xs text-muted-foreground">
            Додајте до 5 слики за да добиете попрецизни понуди
          </p>
        </FieldContent>
      </Field>

      <div className="pt-2">
        <Button type="submit" disabled={!isValid || uploading} className="w-full h-11 text-base font-medium">
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
