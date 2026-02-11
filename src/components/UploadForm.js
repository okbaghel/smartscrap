// app/components/UploadForm.js
"use client";

import { useState } from "react";
import { Upload, FileImage, CheckCircle, XCircle, Loader2, X } from "lucide-react";

export default function UploadForm() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      
      // Create preview for image files
      if (selectedFile.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result);
        };
        reader.readAsDataURL(selectedFile);
      }
      setMessage("");
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
      
      // Create preview for image files
      if (droppedFile.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result);
        };
        reader.readAsDataURL(droppedFile);
      }
      setMessage("");
    }
  };

  const removeFile = () => {
    setFile(null);
    setPreview(null);
    setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setMessage("Please select a file.");
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/upload-image", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      setMessage(result.message || "An error occurred.");
      
      // Clear file after successful upload
      if (response.ok) {
        setTimeout(() => {
          setFile(null);
          setPreview(null);
        }, 2000);
      }
    } catch (error) {
      setMessage("Failed to upload file.");
    } finally {
      setIsLoading(false);
    }
  };

  const isSuccess = message && !message.includes("error") && !message.includes("Failed") && !message.includes("Please");
  const isError = message && (message.includes("error") || message.includes("Failed") || message.includes("Please"));

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Upload Area */}
        <div
          className={`relative border-2 border-dashed rounded-2xl transition-all duration-300 ${
            isDragging
              ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 scale-105"
              : file
              ? "border-emerald-300 dark:border-emerald-700 bg-emerald-50/50 dark:bg-emerald-900/10"
              : "border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800/50 hover:border-emerald-400 dark:hover:border-emerald-600"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            type="file"
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            accept="image/*"
            disabled={isLoading}
          />

          {!file ? (
            /* Upload Prompt */
            <div className="p-8 sm:p-12 text-center space-y-4">
              <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-xl">
                <Upload className="w-10 h-10 sm:w-12 sm:h-12" />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-2">
                  Upload Your Image
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  Drag and drop your file here, or click to browse
                </p>
                <div className="inline-flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-medium">
                  <FileImage className="w-4 h-4" />
                  <span>Supports: JPG, PNG, GIF, WEBP</span>
                </div>
              </div>
            </div>
          ) : (
            /* File Preview */
            <div className="p-6 sm:p-8">
              <div className="bg-white dark:bg-slate-900 rounded-xl p-4 shadow-lg">
                <div className="flex items-start gap-4">
                  {preview ? (
                    <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 border-2 border-emerald-500">
                      <img
                        src={preview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-24 h-24 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center flex-shrink-0">
                      <FileImage className="w-12 h-12 text-white" />
                    </div>
                  )}
                  
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-900 dark:text-white truncate mb-1">
                      {file.name}
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                    <div className="mt-2">
                      <div className="inline-flex items-center gap-1.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-3 py-1 rounded-full text-xs font-medium">
                        <CheckCircle className="w-3 h-3" />
                        Ready to upload
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={removeFile}
                    disabled={isLoading}
                    className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!file || isLoading}
          className="w-full group relative overflow-hidden bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
          <span className="relative flex items-center justify-center gap-2">
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-5 h-5" />
                Upload Image
              </>
            )}
          </span>
        </button>

        {/* Message Display */}
        {message && (
          <div
            className={`rounded-xl p-4 flex items-start gap-3 animate-in fade-in slide-in-from-bottom-4 duration-500 ${
              isSuccess
                ? "bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800"
                : "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
            }`}
          >
            <div
              className={`p-2 rounded-lg ${
                isSuccess
                  ? "bg-emerald-100 dark:bg-emerald-900/40"
                  : "bg-red-100 dark:bg-red-900/40"
              }`}
            >
              {isSuccess ? (
                <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              ) : (
                <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
              )}
            </div>
            <div className="flex-1">
              <p
                className={`font-medium ${
                  isSuccess
                    ? "text-emerald-900 dark:text-emerald-100"
                    : "text-red-900 dark:text-red-100"
                }`}
              >
                {isSuccess ? "Success!" : "Error"}
              </p>
              <p
                className={`text-sm mt-1 ${
                  isSuccess
                    ? "text-emerald-700 dark:text-emerald-300"
                    : "text-red-700 dark:text-red-300"
                }`}
              >
                {message}
              </p>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}