import React, { useEffect, useState } from "react";
import type { ControllerRenderProps } from "react-hook-form";
import { useFormContext, useController } from "react-hook-form";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import { PhotoIcon } from "@heroicons/react/24/solid";

interface TextFieldProps extends ControllerRenderProps {
  name: string;
}
export const FileUpload: React.FC<TextFieldProps> = ({ name }) => {
  const { control, setValue } = useFormContext();
  const {
    field: { value, onChange },
    fieldState: { error },
  } = useController({ name, control });

  useEffect(() => {
    if (value.length === 0) {
      setPreviewUrl(null);
    }
  }, [value]);

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  return (
    <>
      {previewUrl ? (
        <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 p-4 relative">
          <img
            src={previewUrl}
            alt="Preview"
            className="mx-auto h-40 object-contain rounded border"
          />
          <div className="absolute top-1 right-1">
            <IconButton
              aria-label="delete"
              onClick={() => {
                setPreviewUrl(null);
                setValue("file_upload", []);
              }}
            >
              <DeleteIcon />
            </IconButton>
          </div>
        </div>
      ) : (
        <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
          <div className="text-center">
            <PhotoIcon
              aria-hidden="true"
              className="mx-auto size-12 text-gray-300"
            />
            <div className="mt-4 flex text-sm/6 text-gray-600">
              <label
                htmlFor="file-upload"
                className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 focus-within:outline-hidden hover:text-indigo-500"
              >
                <span>Upload a file</span>
                <input
                  id="file-upload"
                  type="file"
                  className="sr-only"
                  onChange={(e) => {
                    const files = e.target.files;
                    if (files && files.length > 0) {
                      const file = files[0];
                      onChange(Array.from(files));
                      const url = URL.createObjectURL(file);
                      setPreviewUrl(url);
                    }
                  }}
                />
              </label>
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs/5 text-gray-600">PNG, JPG, GIF up to 10MB</p>
          </div>
        </div>
      )}

      {error && <p className="text-sm text-red-600">{error.message}</p>}
    </>
  );
};
