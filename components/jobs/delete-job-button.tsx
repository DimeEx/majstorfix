"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { deleteJob } from "@/lib/actions/delete-job";

interface DeleteJobButtonProps {
  jobId: string;
  redirectTo?: string;
  variant?: "default" | "destructive" | "outline" | "ghost";
  size?: "default" | "sm" | "icon" | "icon-sm";
  className?: string;
}

export function DeleteJobButton({ jobId, redirectTo, variant = "destructive", size = "sm", className }: DeleteJobButtonProps) {
  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const result = await deleteJob(jobId);

      if (result?.error) {
        toast.error(result.error);
        setDeleting(false);
        return;
      }

      toast.success("Работата е избришана.");
      setOpen(false);
      if (redirectTo) {
        router.push(redirectTo);
      } else {
        router.refresh();
      }
    } catch {
      toast.error("Настана грешка при бришење.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <Button
        variant={variant}
        size={size}
        onClick={() => setOpen(true)}
        className={className}
      >
        <Trash2 className="h-4 w-4" />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Избриши работа</DialogTitle>
            <DialogDescription>
              Дали сте сигурни дека сакате да ја избришете оваа работа? Ова дејство е неповратно — сите понуди и слики ќе бидат избришани.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter showCloseButton>
            <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
              {deleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Бришење...
                </>
              ) : (
                "Избриши"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
