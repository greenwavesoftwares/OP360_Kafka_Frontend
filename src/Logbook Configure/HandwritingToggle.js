import React, { useState, useRef, useEffect } from 'react';
import { Button } from 'primereact/button';
import { Chip } from '@mui/material';
import { CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';
import Switch from '@mui/material/Switch';
import CreateIcon from '@mui/icons-material/Create';
import KeyboardIcon from '@mui/icons-material/Keyboard';
import './HandwritingToggle.css';

// Custom MUI Switch Component
const CustomHandwritingSwitch = styled(Switch)(({ theme }) => ({
  width: 50,        // decreased from 62
  height: 28,       // decreased from 34
  padding: 5,       // decreased from 7
  '& .MuiSwitch-switchBase': {
    margin: 1,
    padding: 0,
    transform: 'translateX(5px)',  // decreased from 6px
    '&.Mui-checked': {
      color: '#fff',
      transform: 'translateX(17px)',  // decreased from 22px
      '& .MuiSwitch-thumb:before': {
        /* PEN ICON (checked/ON) */
        backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24'><path fill='white' d='M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z'/></svg>")`,
      },
      '& + .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: '#667eea',
      },
    },
  },
  '& .MuiSwitch-thumb': {
    backgroundColor: '#667eea',
    width: 24,        // decreased from 32
    height: 24,       // decreased from 32
    '&:before': {
      content: "''",
      position: 'absolute',
      width: '100%',
      height: '100%',
      left: 0,
      top: 0,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      /* KEYBOARD ICON (unchecked/OFF) */
      backgroundImage: "url(\"data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20width='16'%20height='16'%20viewBox='0%200%2024%2024'%3E%3Cpath%20fill='white'%20d='M20%205H4c-1.1%200-1.99.9-1.99%202L2%2017c0%201.1.9%202%202%202h16c1.1%200%202-.9%202-2V7c0-1.1-.9-2-2-2zm-9%203h2v2h-2V8zm0%203h2v2h-2v-2zM8%208h2v2H8V8zm0%203h2v2H8v-2zm-1%202H5v-2h2v2zm0-3H5V8h2v2zm9%207H8v-2h8v2zm0-4h-2v-2h2v2zm0-3h-2V8h2v2zm3%203h-2v-2h2v2zm0-3h-2V8h2v2z'/%3E%3C/svg%3E\")",
    },
  },
  '& .MuiSwitch-track': {
    opacity: 1,
    backgroundColor: '#aab4be',
    borderRadius: 20 / 2,
  },
}));

const HandwritingToggle = ({
  isHandwritingMode,
  isCanvasOpen,
  currentEditingCell,
  isProcessingHandwriting,
  onToggleChange,
  onCanvasOpen,
  onCanvasClose,
  onHandwritingComplete,
  onCanvasCancel
}) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [context, setContext] = useState(null);
  const [history, setHistory] = useState([]);
  const [historyStep, setHistoryStep] = useState(-1);
  const [lineWidth] = useState(3);
  const [strokeColor] = useState('000000');
  const [tool, setTool] = useState('pen');
  const [showGuideLines, setShowGuideLines] = useState(false);
  const canvasRef = useRef(null);

  // Initialize canvas
  useEffect(() => {
    if (canvasRef.current && isCanvasOpen) {
      initializeCanvas();
    }
  }, [isCanvasOpen]);

  // Update pen settings when changed
  useEffect(() => {
    if (context) {
      context.lineWidth = lineWidth;
      context.strokeStyle = tool === 'eraser' ? '#FFFFFF' : `#${strokeColor}`;
    }
  }, [lineWidth, strokeColor, tool, context]);

  // Redraw guide lines when toggled
  useEffect(() => {
    if (context && canvasRef.current) {
      redrawCanvasWithGuides();
    }
  }, [showGuideLines]);

  const drawGuideLines = (ctx, canvas) => {
    if (!showGuideLines) return;
    
    ctx.save();
    ctx.strokeStyle = '#D3D3D3';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    
    const lineSpacing = 60;
    const startY = lineSpacing;
    
    for (let y = startY; y < canvas.height; y += lineSpacing) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }
    
    ctx.restore();
  };

  const initializeCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.strokeStyle = `#${strokeColor}`;
      ctx.lineWidth = lineWidth;
      
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      drawGuideLines(ctx, canvas);
      
      setContext(ctx);
      saveToHistory(canvas);
    }
  };

  const redrawCanvasWithGuides = () => {
    if (historyStep >= 0 && history.length > 0) {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        drawGuideLines(ctx, canvas);
        ctx.drawImage(img, 0, 0);
      };
      
      img.src = history[historyStep];
    }
  };

  const saveToHistory = (canvas) => {
    if (!canvas) return;
    
    const imageData = canvas.toDataURL('image/jpeg', 0.95);
    setHistory(prev => {
      const newHistory = prev.slice(0, historyStep + 1);
      newHistory.push(imageData);
      if (newHistory.length > 20) {
        newHistory.shift();
        return newHistory;
      }
      return newHistory;
    });
    setHistoryStep(prev => Math.min(prev + 1, 19));
  };

  const restoreFromHistory = (imageData) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      drawGuideLines(ctx, canvas);
      ctx.drawImage(img, 0, 0);
    };
    img.src = imageData;
  };

  const undo = () => {
    if (historyStep > 0) {
      const newStep = historyStep - 1;
      setHistoryStep(newStep);
      restoreFromHistory(history[newStep]);
    }
  };

  const redo = () => {
    if (historyStep < history.length - 1) {
      const newStep = historyStep + 1;
      setHistoryStep(newStep);
      restoreFromHistory(history[newStep]);
    }
  };

  const getCoordinates = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    if (e.type.includes('touch')) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY
      };
    }
    
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };
  };

  const startDrawing = (e) => {
    e.preventDefault();
    const coords = getCoordinates(e);
    if (context) {
      context.beginPath();
      context.moveTo(coords.x, coords.y);
      setIsDrawing(true);
    }
  };

  const draw = (e) => {
    if (!isDrawing || !context) return;
    e.preventDefault();
    
    const coords = getCoordinates(e);
    const pressure = e.pressure || 0.6;
    context.lineWidth = Math.max(3, pressure * lineWidth * 1.5);
    
    context.lineTo(coords.x, coords.y);
    context.stroke();
  };

  const stopDrawing = () => {
    if (isDrawing && context) {
      context.closePath();
      setIsDrawing(false);
      const canvas = canvasRef.current;
      if (canvas) {
        saveToHistory(canvas);
      }
    }
  };

  const handleToggleChange = (event) => {
    onToggleChange(event.target.checked);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (context && canvas) {
      context.fillStyle = '#FFFFFF';
      context.fillRect(0, 0, canvas.width, canvas.height);
      drawGuideLines(context, canvas);
      saveToHistory(canvas);
    }
  };

  const resetHistory = () => {
    setHistory([]);
    setHistoryStep(-1);
    setTool('pen');
    setContext(null);
    setIsDrawing(false);
    setShowGuideLines(false);
  };

  const handleOkClick = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const imageData = canvas.toDataURL('image/jpeg', 0.95);
      const timestamp = Date.now();
      
      onHandwritingComplete({
        imageData,
        timestamp,
        color: strokeColor,
        lineWidth,
        cellId: currentEditingCell?.cellId,
        cellName: currentEditingCell?.aliasId,
        format: 'jpeg'
      });
    }
    
    resetHistory();
  };

  const handleCancelClick = () => {
    resetHistory();
    onCanvasCancel();
  };

  const downloadImage = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const cellName = currentEditingCell?.aliasId || 'handwriting';
      const link = document.createElement('a');
      link.download = `${cellName}_${Date.now()}.jpg`;
      link.href = canvas.toDataURL('image/jpeg', 0.95);
      link.click();
    }
  };

  const toggleGuideLines = () => {
    setShowGuideLines(prev => !prev);
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isCanvasOpen) return;
      
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      }
      else if (((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'z') || 
               (e.ctrlKey && e.key === 'y')) {
        e.preventDefault();
        redo();
      }
      else if (e.key === 'e' || e.key === 'E') {
        e.preventDefault();
        setTool(prev => prev === 'pen' ? 'eraser' : 'pen');
      }
      else if (e.key === 'g' || e.key === 'G') {
        e.preventDefault();
        toggleGuideLines();
      }
      else if (e.key === 'Escape') {
        e.preventDefault();
        handleCancelClick();
      }
      else if (e.key === 'Enter') {
        e.preventDefault();
        handleOkClick();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCanvasOpen, historyStep, history]);

  return (
    <div 
    // className="handwriting-toggle-container"
    >
      <div 
      // className="input-switch-wrapper"
      >
        {/* <KeyboardIcon 
          sx={{ 
            fontSize: 24, 
            color: !isHandwritingMode ? '#667eea' : '#999',
            transition: 'all 0.3s ease',
            transform: !isHandwritingMode ? 'scale(1.2)' : 'scale(1)',
            cursor: 'pointer'
          }}
          onClick={() => onToggleChange(false)}
        /> */}
        <CustomHandwritingSwitch
          checked={isHandwritingMode}
          onChange={handleToggleChange}
        />
        {/* <CreateIcon 
          sx={{ 
            fontSize: 24, 
            color: isHandwritingMode ? '#667eea' : '#999',
            transition: 'all 0.3s ease',
            transform: isHandwritingMode ? 'scale(1.2)' : 'scale(1)',
            cursor: 'pointer'
          }}
          onClick={() => onToggleChange(true)}
        /> */}
      </div>

      {isCanvasOpen && (
        <>
          <div className="canvas-overlay" onClick={handleCancelClick} />
          
          <div className="canvas-dialog-floating">
            {/* Processing Overlay */}
            {isProcessingHandwriting && (
              <div className="processing-overlay">
                <CircularProgress size={50} />
                <p style={{ 
                  marginTop: '15px', 
                  fontWeight: 'bold', 
                  color: '#667eea',
                  fontSize: '16px'
                }}>
                  Converting to text...
                </p>
              </div>
            )}

            <div className="canvas-header-floating">
              <div className="header-left">
                <i className="pi pi-pencil" style={{ marginRight: '8px', fontSize: '14px' }}></i>
                <h3>Handwriting Canvas</h3>
                {currentEditingCell && (
                  <Chip 
                    label={`${currentEditingCell.aliasId} ( ${currentEditingCell.cellId} )`}
                    size="small"
                    color="primary"
                    sx={{ marginLeft: '10px', fontWeight: 'bold', height: '24px', fontSize: '12px' }}
                  />
                )}
              </div>

              <div className="header-controls">
                <Button
                  icon="pi pi-pencil"
                  className={`p-button-text p-button-rounded p-button-sm ${tool === 'pen' ? 'active-tool' : ''}`}
                  onClick={() => setTool('pen')}
                  tooltip="Pen"
                  tooltipOptions={{ position: 'bottom' }}
                />
                <Button
                  icon="pi pi-eraser"
                  className={`p-button-text p-button-rounded p-button-sm ${tool === 'eraser' ? 'active-tool' : ''}`}
                  onClick={() => setTool('eraser')}
                  tooltip="Eraser (E)"
                  tooltipOptions={{ position: 'bottom' }}
                />
                {/* <Button
                  icon="pi pi-bars"
                  className={`p-button-text p-button-rounded p-button-sm ${showGuideLines ? 'active-tool' : ''}`}
                  onClick={toggleGuideLines}
                  tooltip="Toggle Lines (G)"
                  tooltipOptions={{ position: 'bottom' }}
                /> */}
                
                <div className="divider"></div>

                <Button
                  icon="pi pi-undo"
                  className="p-button-text p-button-rounded p-button-sm"
                  onClick={undo}
                  disabled={historyStep <= 0}
                  tooltip="Undo (Ctrl+Z)"
                  tooltipOptions={{ position: 'bottom' }}
                />
                <Button
                  icon="pi pi-refresh"
                  className="p-button-text p-button-rounded p-button-sm"
                  onClick={redo}
                  disabled={historyStep >= history.length - 1}
                  tooltip="Redo (Ctrl+Y)"
                  tooltipOptions={{ position: 'bottom' }}
                />
                
                <div className="divider"></div>

                <Button
                  icon="pi pi-trash"
                  className="p-button-warning p-button-text p-button-rounded p-button-sm"
                  onClick={clearCanvas}
                  tooltip="Clear Canvas"
                  tooltipOptions={{ position: 'bottom' }}
                />
                <Button
                  icon="pi pi-download"
                  className="p-button-info p-button-text p-button-rounded p-button-sm"
                  onClick={downloadImage}
                  tooltip="Download"
                  tooltipOptions={{ position: 'bottom' }}
                />
                
                <div className="divider"></div>

                <Button
                  icon="pi pi-times"
                  className="p-button-secondary p-button-text p-button-rounded p-button-sm"
                  onClick={handleCancelClick}
                  tooltip="Cancel (Esc)"
                  tooltipOptions={{ position: 'bottom' }}
                />
                <Button
                  icon="pi pi-check"
                  className="p-button-success p-button-rounded p-button-sm"
                  onClick={handleOkClick}
                  tooltip="Save (Enter)"
                  tooltipOptions={{ position: 'bottom' }}
                />
              </div>

              <Button
                icon="pi pi-times"
                className="p-button-rounded p-button-text p-button-sm close-btn-header"
                onClick={handleCancelClick}
                tooltip="Close"
                tooltipOptions={{ position: 'left' }}
              />
            </div>
            
            <div className="canvas-content-floating">
              <canvas
                ref={canvasRef}
                width={900}
                height={300}
                onPointerDown={startDrawing}
                onPointerMove={draw}
                onPointerUp={stopDrawing}
                onPointerLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
                className={`drawing-canvas-floating ${tool}`}
                style={{
                  border: '2px solid #ddd',
                  borderRadius: '8px',
                  backgroundColor: '#FFFFFF',
                  cursor: tool === 'eraser' ? 'grab' : 'crosshair',
                  touchAction: 'none',
                  display: 'block',
                  width: '100%',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}
              />
            </div>
            
            <div className="canvas-footer-floating">
              <span className="status-text">
                <i className="pi pi-circle-fill" style={{ 
                  fontSize: '6px', 
                  color: isDrawing ? '#4caf50' : '#9e9e9e',
                  marginRight: '6px'
                }}></i>
                {isDrawing ? (
                  <span style={{ color: '#4caf50', fontWeight: 'bold' }}>
                    {tool === 'eraser' ? 'Erasing...' : 'Drawing...'}
                  </span>
                ) : (
                  `Ready | Guide Lines: ${showGuideLines ? 'ON' : 'OFF'}`
                )}
              </span>
              <span className="shortcuts-hint">
                <strong>G:</strong> Lines | <strong>E:</strong> Eraser | <strong>Ctrl+Z:</strong> Undo | <strong>Enter:</strong> Save | <strong>Esc:</strong> Cancel
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default HandwritingToggle;