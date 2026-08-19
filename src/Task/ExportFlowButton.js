// components/ExportFlowButton.jsx

import React, { useState } from 'react';
// ✅ CHANGED: Use 'reactflow' instead of '@xyflow/react'
import { Panel } from 'reactflow';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ImageIcon from '@mui/icons-material/Image';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import DrawIcon from '@mui/icons-material/Draw';
import CircularProgress from '@mui/material/CircularProgress';
import { Button } from 'primereact/button';
import { useExportFlow } from './useExportFlow';

const ExportFlowButton = ({fileName}) => {
  const { exportImage } = useExportFlow();
  const [isExporting, setIsExporting] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleExport = async (format) => {
    setIsExporting(true);
    handleClose();
    try {
      await exportImage({
        format,
        quality: 4,
        padding: 60,
        backgroundColor: '#ffffff',
        fileName: fileName || "Work-Flow",
      });
    } catch (err) {
      console.error('Export failed:', err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Panel position="top-left">
      <Button
        rounded
        size="small"
        severity="info"
        icon={
          isExporting ? (
            <CircularProgress size={18} color="inherit" />
          ) : (
            'pi pi-download'
          )
        }
        label={isExporting ? 'Exporting...' : 'Export'}
        onClick={handleClick}
        disabled={isExporting}
      />
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem onClick={() => handleExport('png')}>
          <ListItemIcon>
            <ImageIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>PNG (High Quality)</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleExport('svg')}>
          <ListItemIcon>
            <DrawIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>SVG (Vector)</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleExport('jpeg')}>
          <ListItemIcon>
            <InsertPhotoIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>JPEG</ListItemText>
        </MenuItem>
      </Menu>
    </Panel>
  );
};

export default ExportFlowButton;