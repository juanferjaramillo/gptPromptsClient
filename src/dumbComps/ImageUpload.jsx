import React from 'react';
import { Button, CircularProgress, Typography } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const ImageUpload = ({ label, onChange, loading, error }) => (
  <div>
    <Button variant="contained" component="label" startIcon={<CloudUploadIcon />}>
      {label}
      <input type="file" hidden onChange={onChange} accept="image/*" />
    </Button>
    
    {error && <Typography color="error">{error}</Typography>}
  </div>
);

export default ImageUpload;
