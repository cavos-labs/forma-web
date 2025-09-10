"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";

function UploadPaymentContent() {
  const searchParams = useSearchParams();
  const membershipId = searchParams.get("membershipId");
  const paymentId = searchParams.get("paymentId");

  const [file, setFile] = useState<File | null>(null);
  const [sinpeReference, setSinpeReference] = useState("");
  const [sinpePhone, setSinpePhone] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!membershipId || !paymentId) {
      setErrorMessage("Link inválido. Faltan parámetros requeridos.");
    }
  }, [membershipId, paymentId]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      // Validate file type
      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
      ];
      if (!allowedTypes.includes(selectedFile.type)) {
        setErrorMessage(
          "Por favor selecciona una imagen válida (JPEG, PNG, WebP)"
        );
        return;
      }

      // Validate file size (5MB max)
      const maxSize = 5 * 1024 * 1024;
      if (selectedFile.size > maxSize) {
        setErrorMessage("El archivo debe ser menor a 5MB");
        return;
      }

      setFile(selectedFile);
      setErrorMessage("");

      // Create preview URL
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!file || !membershipId || !paymentId) {
      setErrorMessage("Por favor selecciona una imagen del comprobante");
      return;
    }

    setIsUploading(true);
    setUploadStatus("idle");
    setErrorMessage("");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("membershipId", membershipId);
      if (paymentId) formData.append("paymentId", paymentId);
      formData.append("sinpeReference", sinpeReference);
      formData.append("sinpePhone", sinpePhone);

      const response = await fetch("/api/payments/upload", {
        method: "POST",
        headers: {
          "x-api-key": process.env.NEXT_PUBLIC_API_KEY || "",
        },
        body: formData,
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setUploadStatus("success");
      } else {
        setErrorMessage(result.error || "Error al subir el comprobante");
        setUploadStatus("error");
      }
    } catch (error) {
      console.error("Upload error:", error);
      setErrorMessage("Error de conexión. Por favor intenta de nuevo.");
      setUploadStatus("error");
    } finally {
      setIsUploading(false);
    }
  };

  // Cleanup preview URL when component unmounts
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  if (uploadStatus === "success") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="mb-6">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
              <svg
                className="h-6 w-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              ¡Comprobante Enviado!
            </h2>
            <p className="text-gray-600">
              Tu comprobante de pago ha sido enviado exitosamente. El gimnasio
              lo revisará y aprobará tu membresía pronto.
            </p>
          </div>
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              Recibirás una notificación una vez que tu pago sea aprobado y tu
              membresía esté activa.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-gray-800 to-gray-700 px-6 py-8 text-center">
            <img
              src="https://formacr.com/images/forma-logo-white.png"
              alt="Forma App"
              className="h-12 mx-auto mb-4"
            />
            <h1 className="text-2xl font-bold text-white">
              Subir Comprobante de Pago
            </h1>
            <p className="text-gray-200 mt-2">
              Sube tu comprobante SINPE para activar tu membresía
            </p>
          </div>

          {/* Form */}
          <div className="px-6 py-8">
            {errorMessage && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
                <div className="flex">
                  <svg
                    className="h-5 w-5 text-red-400 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p className="text-sm text-red-700">{errorMessage}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* File Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Comprobante de Pago *
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-gray-400 transition-colors">
                  <div className="space-y-1 text-center">
                    {previewUrl ? (
                      <div className="mb-4">
                        <img
                          src={previewUrl}
                          alt="Preview"
                          className="mx-auto h-32 w-32 object-cover rounded-md"
                        />
                        <p className="text-sm text-gray-600 mt-2">
                          {file?.name}
                        </p>
                      </div>
                    ) : (
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                      >
                        <path
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                    <div className="flex text-sm text-gray-600">
                      <label className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                        <span>
                          {file ? "Cambiar imagen" : "Seleccionar imagen"}
                        </span>
                        <input
                          type="file"
                          className="sr-only"
                          accept="image/jpeg,image/jpg,image/png,image/webp"
                          onChange={handleFileChange}
                          required
                        />
                      </label>
                      <p className="pl-1">o arrastra y suelta</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, WebP hasta 5MB
                    </p>
                  </div>
                </div>
              </div>

              {/* SINPE Reference */}
              <div>
                <label
                  htmlFor="sinpeReference"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Referencia SINPE (opcional)
                </label>
                <input
                  type="text"
                  id="sinpeReference"
                  value={sinpeReference}
                  onChange={(e) => setSinpeReference(e.target.value)}
                  className="block w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Ej: REF123456789"
                />
              </div>

              {/* SINPE Phone */}
              <div>
                <label
                  htmlFor="sinpePhone"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Teléfono SINPE (opcional)
                </label>
                <input
                  type="tel"
                  id="sinpePhone"
                  value={sinpePhone}
                  onChange={(e) => setSinpePhone(e.target.value)}
                  className="block w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Ej: +506 8888-8888"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isUploading || !file}
                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                  isUploading || !file
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700"
                }`}
              >
                {isUploading ? (
                  <div className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Subiendo...
                  </div>
                ) : (
                  "📤 Enviar Comprobante"
                )}
              </button>
            </form>

            {/* Instructions */}
            <div className="mt-8 bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-900 mb-2">
                📋 Instrucciones:
              </h3>
              <ol className="text-sm text-gray-600 space-y-1">
                <li>
                  1. Toma una captura de pantalla clara del comprobante SINPE
                </li>
                <li>2. Asegúrate de que se vean todos los detalles del pago</li>
                <li>3. Sube la imagen usando el formulario de arriba</li>
                <li>4. El gimnasio revisará y aprobará tu pago pronto</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function UploadPaymentPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando...</p>
          </div>
        </div>
      }
    >
      <UploadPaymentContent />
    </Suspense>
  );
}
