import React from 'react';
import { Box, Typography } from '@mui/material';

const ImagePreview = ({ src, title }) => (
  <Box mt={2} width="300px" height="200px" sx={{ border: 1, borderColor: 'red' }}>
    {src && <img src={src} alt={title} style={{ maxWidth: '300px', maxHeight: '200px' }} />}
    <Typography>{title}</Typography>
  </Box>
);

export default ImagePreview;
