"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, X, ImageIcon } from "lucide-react";
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { getThumbnailUrl, getLightboxUrl } from "@/lib/supabase/storage";

interface ImageGalleryProps {
  images: string[];
}

function Placeholder() {
  return <div className="absolute inset-0 rounded-lg bg-muted animate-pulse" />;
}

export function ImageGallery({ images }: ImageGalleryProps) {
  const [open, setOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loadedThumb, setLoadedThumb] = useState<Record<number, boolean>>({});
  const [lightboxLoaded, setLightboxLoaded] = useState(false);

  if (!images || images.length === 0) return null;

  const openViewer = (index: number) => {
    setCurrentIndex(index);
    setLightboxLoaded(false);
    setOpen(true);
  };

  const goTo = (index: number) => {
    setCurrentIndex((index + images.length) % images.length);
    setLightboxLoaded(false);
  };

  return (
    <div>
      <div className="flex items-center gap-1.5 mb-2 text-xs text-muted-foreground">
        <ImageIcon className="h-3.5 w-3.5" />
        <span>{images.length} {images.length === 1 ? "слика" : "слики"}</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {images.map((url, i) => (
          <button
            key={i}
            type="button"
            onClick={() => openViewer(i)}
            className="group relative aspect-[4/3] overflow-hidden rounded-lg border border-border/50 bg-muted transition-all hover:ring-2 hover:ring-primary/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            {!loadedThumb[i] && <Placeholder />}
            <img
              src={getThumbnailUrl(url)}
              alt={`Слика ${i + 1}`}
              className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
              loading={i < 3 ? "eager" : "lazy"}
              decoding="async"
              fetchPriority={i < 2 ? "high" : "auto"}
              onLoad={() => setLoadedThumb((p) => ({ ...p, [i]: true }))}
              onError={() => setLoadedThumb((p) => ({ ...p, [i]: true }))}
              style={loadedThumb[i] ? {} : { opacity: 0.01 }}
            />
            <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/5" />
          </button>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl p-0 overflow-hidden bg-black/95 ring-0 sm:max-w-[90vw]">
          <div className="relative flex items-center justify-center min-h-[50vh] max-h-[85vh]">
            {images.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-2 z-10 h-10 w-10 rounded-full bg-white/10 text-white hover:bg-white/20"
                  onClick={() => goTo(currentIndex - 1)}
                  aria-label="Претходна слика"
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 z-10 h-10 w-10 rounded-full bg-white/10 text-white hover:bg-white/20"
                  onClick={() => goTo(currentIndex + 1)}
                  aria-label="Следна слика"
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
              </>
            )}

            {!lightboxLoaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              </div>
            )}

            <img
              src={getLightboxUrl(images[currentIndex])}
              alt={`Слика ${currentIndex + 1}`}
              className={`max-h-[85vh] w-full object-contain p-4 transition-opacity duration-200 ${lightboxLoaded ? "opacity-100" : "opacity-0"}`}
              loading="eager"
              fetchPriority="high"
              onLoad={() => setLightboxLoaded(true)}
              onError={() => setLightboxLoaded(true)}
            />

            <DialogClose
              className="absolute top-2 right-2 z-10"
              render={
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-white/10 text-white hover:bg-white/20">
                  <X className="h-4 w-4" />
                </Button>
              }
            />
          </div>

          {images.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-3 py-1 text-xs text-white">
              {currentIndex + 1} / {images.length}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
