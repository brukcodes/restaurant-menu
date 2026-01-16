import { useState, useRef, ChangeEvent } from "react";
import { Upload, X, Link as LinkIcon } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

interface MediaUploadProps {
  type: "image" | "video";
  value: string;
  onChange: (value: string) => void;
  label: string;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export const MediaUpload = ({
  type,
  value,
  onChange,
  label,
}: MediaUploadProps) => {
  const [urlInput, setUrlInput] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      alert("File size too large. Please choose a file under 10MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        onChange(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      onChange(urlInput.trim());
      setUrlInput("");
    }
  };

  const handleRemove = () => {
    onChange("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">{label}</label>

      {value && (
        <div className="relative rounded-xl overflow-hidden bg-gray-100">
          {type === "image" ? (
            <img
              src={value}
              alt="Preview"
              className="w-full h-48 object-cover"
              onError={(e) => {
                console.error("Preview image failed to load");
                e.currentTarget.style.display = "none";
              }}
            />
          ) : (
            <video
              className="w-full h-48 object-cover"
              controls
              playsInline
              preload="metadata"
              onError={(e) => {
                console.error("Preview video failed to load");
              }}
            >
              <source src={value} type="video/mp4" />
            </video>
          )}
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-primary hover:bg-gray-50 transition-all"
      >
        <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
        <p className="text-sm text-gray-600">Click to upload {type}</p>
        <input
          ref={fileInputRef}
          type="file"
          accept={type === "image" ? "image/*" : "video/*"}
          onChange={handleFileUpload}
          className="hidden"
        />
      </div>

      <div className="flex gap-2">
        <div className="flex-1 relative">
          <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            type="url"
            placeholder={`Or paste ${type} URL here`}
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            className="pl-10 bg-gray-50 text-gray-900 border-gray-300"
          />
        </div>
        <Button
          type="button"
          onClick={handleUrlSubmit}
          disabled={!urlInput.trim()}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          Use URL
        </Button>
      </div>
    </div>
  );
};
