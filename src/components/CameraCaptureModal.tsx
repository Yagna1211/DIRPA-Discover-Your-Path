import React, { useRef, useState, useEffect } from 'react';
import { Camera, RefreshCw, X, Check, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface CameraCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (base64Image: string) => void;
}

export const CameraCaptureModal: React.FC<CameraCaptureModalProps> = ({
  isOpen,
  onClose,
  onCapture
}) => {
  const { t } = useTranslation();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedData, setCapturedData] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');

  useEffect(() => {
    if (!isOpen) {
      stopStream();
      setCapturedData(null);
      setCameraError(null);
      return;
    }

    startCamera(facingMode);

    return () => {
      stopStream();
    };
  }, [isOpen, facingMode]);

  const startCamera = async (mode: 'user' | 'environment') => {
    stopStream();
    setCameraError(null);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: mode,
          width: { ideal: 640 },
          height: { ideal: 640 }
        },
        audio: false
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err: any) {
      console.error("Camera access error:", err);
      setCameraError(err.message || "Unable to access device camera. Please check permissions.");
    }
  };

  const stopStream = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const takeSnapshot = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;

    const maxDim = 256;
    let width = video.videoWidth || 400;
    let height = video.videoHeight || 400;

    if (width > maxDim || height > maxDim) {
      if (width > height) {
        height = Math.round((height * maxDim) / width);
        width = maxDim;
      } else {
        width = Math.round((width * maxDim) / height);
        height = maxDim;
      }
    }

    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      if (facingMode === 'user') {
        ctx.translate(width, 0);
        ctx.scale(-1, 1);
      }
      ctx.drawImage(video, 0, 0, width, height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.75);
      setCapturedData(dataUrl);
    }
  };

  const confirmPhoto = () => {
    if (capturedData) {
      onCapture(capturedData);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 animate-fade-in" id="camera-capture-modal">
      <div className="bg-white border-4 border-black w-full max-w-md rounded-2xl overflow-hidden shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        {/* Header */}
        <div className="p-4 bg-amber-400 border-b-2 border-black flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-black" />
            <h3 className="text-base font-display font-black uppercase text-black">{t('modals.cameraModalTitle', 'Take Profile Photo')}</h3>
          </div>
          <button 
            type="button" 
            onClick={onClose}
            className="p-1 hover:bg-black/10 rounded border border-black cursor-pointer"
          >
            <X className="w-5 h-5 text-black" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col items-center justify-center bg-stone-900 text-white">
          {cameraError ? (
            <div className="text-center py-8 space-y-3 px-4">
              <AlertCircle className="w-12 h-12 text-amber-400 mx-auto" />
              <p className="text-xs font-bold text-amber-200">{cameraError}</p>
              <p className="text-[11px] text-gray-400">
                {t('profile.fromGalleryPrompt', 'You can also use your device file picker ("From gallery") to upload an image file directly.')}
              </p>
              <button
                type="button"
                onClick={() => startCamera(facingMode)}
                className="mt-2 px-4 py-2 bg-amber-400 text-black font-black uppercase text-xs border border-black cursor-pointer hover:bg-amber-500"
              >
                {t('common.retry', 'Retry Camera')}
              </button>
            </div>
          ) : capturedData ? (
            <div className="flex flex-col items-center space-y-4 w-full">
              <div className="w-48 h-48 rounded-full border-4 border-amber-400 overflow-hidden shadow-2xl bg-black">
                <img src={capturedData} alt="Captured preview" className="w-full h-full object-cover" />
              </div>
              <p className="text-xs font-bold text-amber-300">{t('modals.previewPhoto', 'Preview captured photo')}</p>
              <div className="flex gap-3 w-full pt-2">
                <button
                  type="button"
                  onClick={() => setCapturedData(null)}
                  className="flex-1 py-2.5 bg-stone-700 hover:bg-stone-600 text-white font-black uppercase text-xs border border-white/20 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4" /> {t('modals.retake', 'Retake')}
                </button>
                <button
                  type="button"
                  onClick={confirmPhoto}
                  className="flex-1 py-2.5 bg-amber-400 hover:bg-amber-300 text-black font-black uppercase text-xs border border-black flex items-center justify-center gap-1.5 shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] cursor-pointer"
                >
                  <Check className="w-4 h-4" /> {t('modals.usePhoto', 'Use Photo')}
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-4 w-full">
              {/* Camera Video Viewport */}
              <div className="relative w-56 h-56 rounded-full border-4 border-amber-400 overflow-hidden bg-black shadow-2xl flex items-center justify-center">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className={`w-full h-full object-cover ${facingMode === 'user' ? 'scale-x-[-1]' : ''}`}
                />
                {/* Center Circle Target Frame */}
                <div className="absolute inset-0 border-2 border-dashed border-amber-300/40 rounded-full pointer-events-none" />
              </div>

              <div className="flex items-center gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => setFacingMode(prev => prev === 'user' ? 'environment' : 'user')}
                  className="p-2.5 bg-stone-800 hover:bg-stone-700 text-white rounded-full border border-stone-600 cursor-pointer"
                  title="Switch camera"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={takeSnapshot}
                  className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-black font-black uppercase text-sm border-2 border-black rounded-full flex items-center gap-2 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:scale-95 cursor-pointer"
                >
                  <Camera className="w-5 h-5" /> {t('modals.snapPhoto', 'Snap Photo')}
                </button>
              </div>
            </div>
          )}
        </div>

        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
};
