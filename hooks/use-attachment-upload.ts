"use client";

import { useCallback, useMemo, useState } from "react";

export function useAttachmentUpload() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [stagedUrl, setStagedUrl] = useState<string>("");
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const onUploaded = useCallback((url: string) => {
    setStagedUrl(url);
    setIsOpen(false);
    setIsUploading(false);
  }, []);

  const clearImage = useCallback(() => {
    setStagedUrl(""), setIsUploading(false);
  }, []);

  return useMemo(
    () => ({
      isOpen,
      setIsOpen,
      onUploaded,
      stagedUrl,
      setStagedUrl,
      isUploading,
      setIsUploading,
      clearImage,
    }),
    [
      isOpen,
      setIsOpen,
      onUploaded,
      stagedUrl,
      setStagedUrl,
      isUploading,
      setIsUploading,
      clearImage,
    ]
  );
}

export type useAttachmentUploadType = ReturnType<typeof useAttachmentUpload>;
