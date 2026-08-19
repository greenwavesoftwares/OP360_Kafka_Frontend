// src/components/QRScannerDialog.jsx
import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  IconButton,
  CircularProgress,
  Alert,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CameraswitchIcon from '@mui/icons-material/Cameraswitch';
import FlashlightOnIcon from '@mui/icons-material/FlashlightOn';
import FlashlightOffIcon from '@mui/icons-material/FlashlightOff';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';

const SCANNER_REGION_ID = 'qr-scanner-region';

const ALL_FORMATS = [
  Html5QrcodeSupportedFormats.QR_CODE,
  Html5QrcodeSupportedFormats.AZTEC,
  Html5QrcodeSupportedFormats.CODABAR,
  Html5QrcodeSupportedFormats.CODE_39,
  Html5QrcodeSupportedFormats.CODE_93,
  Html5QrcodeSupportedFormats.CODE_128,
  Html5QrcodeSupportedFormats.DATA_MATRIX,
  Html5QrcodeSupportedFormats.MAXICODE,
  Html5QrcodeSupportedFormats.ITF,
  Html5QrcodeSupportedFormats.EAN_13,
  Html5QrcodeSupportedFormats.EAN_8,
  Html5QrcodeSupportedFormats.PDF_417,
  Html5QrcodeSupportedFormats.RSS_14,
  Html5QrcodeSupportedFormats.RSS_EXPANDED,
  Html5QrcodeSupportedFormats.UPC_A,
  Html5QrcodeSupportedFormats.UPC_E,
  Html5QrcodeSupportedFormats.UPC_EAN_EXTENSION,
];

const isMobileDevice = () =>
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );

const getQrBoxSize = (containerWidth) => {
  if (containerWidth < 300) return { width: 200, height: 150 };
  if (containerWidth < 400) return { width: 240, height: 180 };
  return { width: 280, height: 200 };
};

const QRScannerDialog = ({ open, onClose, onScanSuccess }) => {
  const scannerRef = useRef(null);
  const isStartingRef = useRef(false);
  const hasScannedRef = useRef(false);
  const mountedRef = useRef(true);

  const [isStarting, setIsStarting] = useState(false);
  const [error, setError] = useState(null);
  const [cameras, setCameras] = useState([]);
  const [selectedCamera, setSelectedCamera] = useState('');
  const [useFacingMode, setUseFacingMode] = useState(true);
  const [currentFacingMode, setCurrentFacingMode] = useState('environment');
  const [scannerReady, setScannerReady] = useState(false);

  // ── Flashlight state ──
  const [torchOn, setTorchOn] = useState(false);
  const [torchSupported, setTorchSupported] = useState(false);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  // Track mount state
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // ── Get active video track from scanner ──
  const getVideoTrack = useCallback(() => {
    try {
      const scannerElement = document.getElementById(SCANNER_REGION_ID);
      if (!scannerElement) return null;

      const videoEl = scannerElement.querySelector('video');
      if (!videoEl || !videoEl.srcObject) return null;

      const tracks = videoEl.srcObject.getVideoTracks();
      return tracks.length > 0 ? tracks[0] : null;
    } catch (err) {
      console.warn('Could not get video track:', err);
      return null;
    }
  }, []);

  // ── Check if torch/flashlight is supported ──
  const checkTorchSupport = useCallback(() => {
    try {
      const track = getVideoTrack();
      if (!track) {
        setTorchSupported(false);
        return;
      }

      const capabilities = track.getCapabilities?.();
      if (capabilities && capabilities.torch) {
        setTorchSupported(true);
        console.log('✅ Torch/flashlight is supported');
      } else {
        setTorchSupported(false);
        console.log('❌ Torch/flashlight not supported on this camera');
      }
    } catch (err) {
      console.warn('Torch check failed:', err);
      setTorchSupported(false);
    }
  }, [getVideoTrack]);

  // ── Toggle flashlight ──
  const toggleTorch = useCallback(async () => {
    try {
      const track = getVideoTrack();
      if (!track) {
        console.warn('No video track available');
        return;
      }

      const newTorchState = !torchOn;

      await track.applyConstraints({
        advanced: [{ torch: newTorchState }],
      });

      setTorchOn(newTorchState);
      console.log(`Torch ${newTorchState ? 'ON' : 'OFF'}`);
    } catch (err) {
      console.error('Failed to toggle torch:', err);
      setTorchSupported(false);
    }
  }, [torchOn, getVideoTrack]);

  // ── Turn off torch explicitly ──
  const turnOffTorch = useCallback(async () => {
    try {
      const track = getVideoTrack();
      if (track && torchOn) {
        await track.applyConstraints({
          advanced: [{ torch: false }],
        });
      }
    } catch (err) {
      // Ignore
    }
    setTorchOn(false);
  }, [torchOn, getVideoTrack]);

  // Stop scanner safely
  const stopScanner = useCallback(async () => {
    // Turn off torch before stopping
    await turnOffTorch();

    if (scannerRef.current) {
      try {
        const state = scannerRef.current.getState();
        if (state === 2 || state === 3) {
          await scannerRef.current.stop();
        }
      } catch (err) {
        console.warn('Error stopping scanner:', err);
      }
      try {
        scannerRef.current.clear();
      } catch (err) {
        // DOM element may already be gone
      }
      scannerRef.current = null;
    }

    setTorchSupported(false);
    setTorchOn(false);
  }, [turnOffTorch]);

  // Close handler
  const handleClose = useCallback(async () => {
    await stopScanner();
    if (mountedRef.current) {
      setError(null);
      setCameras([]);
      setSelectedCamera('');
      setScannerReady(false);
      setUseFacingMode(true);
      setTorchOn(false);
      setTorchSupported(false);
      hasScannedRef.current = false;
    }
    onClose();
  }, [stopScanner, onClose]);

  // Start scanner
  const startScanner = useCallback(
    async (cameraConfig) => {
      if (isStartingRef.current) return;
      isStartingRef.current = true;

      await stopScanner();

      if (!mountedRef.current) {
        isStartingRef.current = false;
        return;
      }

      setIsStarting(true);
      setError(null);
      setScannerReady(false);
      setTorchOn(false);
      setTorchSupported(false);

      await new Promise((resolve) => setTimeout(resolve, 300));

      if (!mountedRef.current) {
        isStartingRef.current = false;
        return;
      }

      const scannerElement = document.getElementById(SCANNER_REGION_ID);
      if (!scannerElement) {
        setError('Scanner container not found. Please try again.');
        setIsStarting(false);
        isStartingRef.current = false;
        return;
      }

      try {
        const containerWidth = scannerElement.clientWidth || 300;
        const qrboxSize = getQrBoxSize(containerWidth);

        const html5Qrcode = new Html5Qrcode(SCANNER_REGION_ID, {
          formatsToSupport: ALL_FORMATS,
          verbose: false,
        });

        scannerRef.current = html5Qrcode;

        const scanConfig = {
          fps: 10,
          qrbox: qrboxSize,
          aspectRatio: isMobileDevice() ? 1.333 : 1.0,
          disableFlip: false,
        };

        let cameraId;
        if (typeof cameraConfig === 'object' && cameraConfig.facingMode) {
          cameraId = { facingMode: { exact: cameraConfig.facingMode } };
        } else if (
          typeof cameraConfig === 'string' &&
          cameraConfig.length > 0
        ) {
          cameraId = cameraConfig;
        } else {
          cameraId = { facingMode: { exact: 'environment' } };
        }

        console.log('Starting scanner with:', JSON.stringify(cameraId));

        await html5Qrcode.start(
          cameraId,
          scanConfig,
          (decodedText, decodedResult) => {
            if (!hasScannedRef.current) {
              hasScannedRef.current = true;
              console.log(
                `Scanned: ${decodedText} | Format: ${decodedResult?.result?.format?.formatName}`
              );
              if (navigator.vibrate) navigator.vibrate(200);
              onScanSuccess(decodedText, decodedResult);
              handleClose();
            }
          },
          () => {}
        );

        if (mountedRef.current) {
          setIsStarting(false);
          setScannerReady(true);

          const videoEl = scannerElement.querySelector('video');
          if (videoEl) {
            videoEl.setAttribute('playsinline', 'true');
            videoEl.setAttribute('webkit-playsinline', 'true');
            videoEl.style.objectFit = 'cover';
          }

          // Check torch support after camera starts
          // Small delay to ensure video track is fully initialized
          setTimeout(() => {
            if (mountedRef.current) {
              checkTorchSupport();
            }
          }, 500);
        }
      } catch (err) {
        console.error('Error starting scanner:', err);
        if (mountedRef.current) {
          setIsStarting(false);
          const errMsg = err?.message || String(err);

          if (
            errMsg.includes('OverconstrainedError') ||
            errMsg.includes('Overconstrained')
          ) {
            console.log('Exact facingMode failed, retrying without exact...');
            setError(null);
            isStartingRef.current = false;
            retryWithoutExact(cameraConfig);
            return;
          } else if (
            errMsg.includes('NotAllowedError') ||
            errMsg.includes('Permission')
          ) {
            setError(
              'Camera permission denied. Please allow camera access in your browser settings.'
            );
          } else if (errMsg.includes('NotFoundError')) {
            setError('No camera found on this device.');
          } else if (errMsg.includes('NotReadableError')) {
            setError('Camera is in use by another app.');
          } else {
            setError(`Camera error: ${errMsg}`);
          }
        }
      }

      isStartingRef.current = false;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [stopScanner, onScanSuccess, handleClose, checkTorchSupport]
  );

  // Retry without exact constraint
  const retryWithoutExact = useCallback(
    async (cameraConfig) => {
      await stopScanner();

      const scannerElement = document.getElementById(SCANNER_REGION_ID);
      if (!scannerElement) return;

      try {
        const containerWidth = scannerElement.clientWidth || 300;
        const qrboxSize = getQrBoxSize(containerWidth);

        const html5Qrcode = new Html5Qrcode(SCANNER_REGION_ID, {
          formatsToSupport: ALL_FORMATS,
          verbose: false,
        });

        scannerRef.current = html5Qrcode;

        let cameraId;
        if (typeof cameraConfig === 'object' && cameraConfig.facingMode) {
          cameraId = { facingMode: cameraConfig.facingMode };
        } else {
          cameraId = { facingMode: 'environment' };
        }

        await html5Qrcode.start(
          cameraId,
          {
            fps: 10,
            qrbox: qrboxSize,
            aspectRatio: isMobileDevice() ? 1.333 : 1.0,
            disableFlip: false,
          },
          (decodedText, decodedResult) => {
            if (!hasScannedRef.current) {
              hasScannedRef.current = true;
              if (navigator.vibrate) navigator.vibrate(200);
              onScanSuccess(decodedText, decodedResult);
              handleClose();
            }
          },
          () => {}
        );

        if (mountedRef.current) {
          setIsStarting(false);
          setScannerReady(true);

          setTimeout(() => {
            if (mountedRef.current) checkTorchSupport();
          }, 500);
        }
      } catch (err) {
        console.error('Retry also failed:', err);
        tryFallbackCamera();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [stopScanner, onScanSuccess, handleClose, checkTorchSupport]
  );

  // Fallback: enumerate cameras
  const tryFallbackCamera = useCallback(async () => {
    try {
      const devices = await Html5Qrcode.getCameras();
      if (devices && devices.length > 0) {
        setCameras(devices);
        setUseFacingMode(false);
        setSelectedCamera(devices[0].id);
      } else {
        setError('No cameras found on this device.');
      }
    } catch (err) {
      setError('Unable to access camera. Please check permissions.');
    }
  }, []);

  // Initialize when dialog opens
  useEffect(() => {
    if (!open) return;

    hasScannedRef.current = false;
    setError(null);

    const initCamera = async () => {
      if (isMobileDevice()) {
        setUseFacingMode(true);
        setCurrentFacingMode('environment');
        startScanner({ facingMode: 'environment' });

        Html5Qrcode.getCameras()
          .then((devices) => {
            if (mountedRef.current && devices?.length > 0) {
              setCameras(devices);
            }
          })
          .catch(() => {});
      } else {
        try {
          const devices = await Html5Qrcode.getCameras();
          if (!mountedRef.current) return;

          if (devices && devices.length > 0) {
            setCameras(devices);
            setUseFacingMode(false);

            const backCamera = devices.find(
              (d) =>
                d.label.toLowerCase().includes('back') ||
                d.label.toLowerCase().includes('rear') ||
                d.label.toLowerCase().includes('environment')
            );
            setSelectedCamera(backCamera ? backCamera.id : devices[0].id);
          } else {
            setError('No cameras found.');
          }
        } catch (err) {
          if (mountedRef.current) {
            setError('Unable to access camera. Please check permissions.');
          }
        }
      }
    };

    initCamera();

    return () => {
      stopScanner();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // When selectedCamera changes
  useEffect(() => {
    if (!open || !selectedCamera || useFacingMode) return;

    startScanner(selectedCamera);

    return () => {
      stopScanner();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCamera, open, useFacingMode]);

  const handleCameraChange = (event) => {
    setUseFacingMode(false);
    setSelectedCamera(event.target.value);
  };

  const handleSwitchCamera = () => {
    if (useFacingMode) {
      const newMode =
        currentFacingMode === 'environment' ? 'user' : 'environment';
      setCurrentFacingMode(newMode);
      startScanner({ facingMode: newMode });
    } else if (cameras.length > 1) {
      const currentIndex = cameras.findIndex((c) => c.id === selectedCamera);
      const nextIndex = (currentIndex + 1) % cameras.length;
      setSelectedCamera(cameras[nextIndex].id);
    }
  };

  const canSwitchCamera = useFacingMode || cameras.length > 1;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      fullScreen={isSmallScreen}
      PaperProps={{
        sx: {
          borderRadius: isSmallScreen ? 0 : 3,
          overflow: 'hidden',
          maxHeight: isSmallScreen ? '100vh' : '90vh',
        },
      }}
      disableScrollLock={false}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          bgcolor: 'primary.main',
          color: 'white',
          py: 1.5,
          px: 2,
          pt: isSmallScreen ? 'max(12px, env(safe-area-inset-top))' : 1.5,
        }}
      >
        <Typography variant="h6" component="span" fontWeight="bold">
          📷 Scan Code
        </Typography>
        <IconButton onClick={handleClose} sx={{ color: 'white' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent
        sx={{
          p: 2,
          bgcolor: '#000',
          display: 'flex',
          flexDirection: 'column',
          flex: isSmallScreen ? 1 : 'unset',
        }}
      >
        {/* ── Top controls: camera selector + switch + torch ── */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            mb: 1.5,
            mt: 0.5,
          }}
        >
          {/* Camera dropdown (desktop / fallback) */}
          {!useFacingMode && cameras.length > 1 && (
            <FormControl
              size="small"
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: 'white',
                  '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                },
                '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
                '& .MuiSelect-icon': { color: 'white' },
              }}
            >
              <InputLabel>Camera</InputLabel>
              <Select
                value={selectedCamera}
                onChange={handleCameraChange}
                label="Camera"
              >
                {cameras.map((camera, idx) => (
                  <MenuItem key={camera.id} value={camera.id}>
                    {camera.label || `Camera ${idx + 1}`}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          {/* Spacer */}
          <Box sx={{ flex: 1 }} />

          {/* ── Flashlight toggle button ── */}
          {torchSupported && (
            <IconButton
              onClick={toggleTorch}
              sx={{
                color: torchOn ? '#FFD600' : 'white',
                bgcolor: torchOn
                  ? 'rgba(255, 214, 0, 0.2)'
                  : 'rgba(255,255,255,0.1)',
                '&:hover': {
                  bgcolor: torchOn
                    ? 'rgba(255, 214, 0, 0.35)'
                    : 'rgba(255,255,255,0.2)',
                },
                transition: 'all 0.2s ease',
                border: torchOn ? '1px solid #FFD600' : '1px solid transparent',
              }}
              title={torchOn ? 'Turn off flashlight' : 'Turn on flashlight'}
            >
              {torchOn ? <FlashlightOnIcon /> : <FlashlightOffIcon />}
            </IconButton>
          )}

          {/* Camera switch button */}
          {/* {canSwitchCamera && (
            <IconButton
              onClick={handleSwitchCamera}
              sx={{
                color: 'white',
                bgcolor: 'rgba(255,255,255,0.1)',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' },
              }}
              title="Switch Camera"
            >
              <CameraswitchIcon />
            </IconButton>
          )} */}
        </Box>

        {/* Error */}
        {error && (
          <Alert
            severity="error"
            sx={{ mb: 2, whiteSpace: 'pre-line' }}
            action={
              <Button
                color="inherit"
                size="small"
                onClick={() => {
                  setError(null);
                  if (useFacingMode) {
                    startScanner({ facingMode: currentFacingMode });
                  } else if (selectedCamera) {
                    startScanner(selectedCamera);
                  }
                }}
              >
                RETRY
              </Button>
            }
          >
            {error}
          </Alert>
        )}

        {/* Loading */}
        {isStarting && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column',
              py: 4,
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 10,
            }}
          >
            <CircularProgress size={48} sx={{ color: 'white' }} />
            <Typography variant="body2" sx={{ mt: 2, color: 'white' }}>
              Starting camera...
            </Typography>
          </Box>
        )}

        {/* Scanner Region */}
        <Box
          sx={{
            position: 'relative',
            borderRadius: 2,
            overflow: 'hidden',
            bgcolor: 'black',
            flex: isSmallScreen ? 1 : 'unset',
            minHeight: isSmallScreen ? 'unset' : 300,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            '& video': {
              width: '100% !important',
              height: isSmallScreen ? '100% !important' : 'auto !important',
              objectFit: 'cover',
              borderRadius: '8px',
            },
            '& #qr-shaded-region': {
              borderColor: '#4caf50 !important',
            },
          }}
        >
          <div
            id={SCANNER_REGION_ID}
            style={{
              width: '100%',
              minHeight: isSmallScreen ? '100%' : 300,
            }}
          />

          {/* Scan line animation */}
          {scannerReady && (
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                pointerEvents: 'none',
                zIndex: 5,
              }}
            >
              <Box
                sx={{
                  width: isSmallScreen ? 220 : 260,
                  height: isSmallScreen ? 160 : 190,
                  border: '3px solid #4caf50',
                  borderRadius: 2,
                  position: 'relative',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '3px',
                    bgcolor: '#4caf50',
                    animation: 'scanLine 2s ease-in-out infinite',
                    boxShadow: '0 0 8px rgba(76, 175, 80, 0.8)',
                  },
                  '@keyframes scanLine': {
                    '0%': { top: 0 },
                    '50%': { top: 'calc(100% - 3px)' },
                    '100%': { top: 0 },
                  },
                }}
              />
            </Box>
          )}

          {/* ── Torch ON indicator overlay ── */}
          {torchOn && (
            <Box
              sx={{
                position: 'absolute',
                top: 12,
                left: '50%',
                transform: 'translateX(-50%)',
                bgcolor: 'rgba(255, 214, 0, 0.85)',
                color: '#000',
                px: 2,
                py: 0.5,
                borderRadius: 5,
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                zIndex: 10,
                fontSize: '0.75rem',
                fontWeight: 'bold',
              }}
            >
              <FlashlightOnIcon sx={{ fontSize: 16 }} />
              Flash ON
            </Box>
          )}
        </Box>

        <Typography
          variant="caption"
          sx={{
            display: 'block',
            textAlign: 'center',
            mt: 1.5,
            color: 'rgba(255,255,255,0.7)',
          }}
        >
          Point the camera at a QR code or barcode
        </Typography>
      </DialogContent>

      <DialogActions
        sx={{
          px: 2,
          py: 1.5,
          bgcolor: '#111',
          justifyContent: 'center',
          pb: isSmallScreen
            ? 'max(12px, env(safe-area-inset-bottom))'
            : 1.5,
        }}
      >
        <Button onClick={handleClose} variant="contained" color="error">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default QRScannerDialog;