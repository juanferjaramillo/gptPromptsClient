// App.jsx
import { useState } from 'react';
import { Box, Button, Typography, CircularProgress } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

function App() {
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'your_upload_preset'); // Replace with your Cloudinary upload preset

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('https://api.cloudinary.com/v1_1/your_cloud_name/image/upload', {
        method: 'POST',
        body: formData
      });

      const data = await res.json();
      if (data.secure_url) {
        setImageUrl(data.secure_url);
      } else {
        setError('Upload failed');
      }
    } catch (err) {
      setError('An error occurred during upload');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box p={4} display="flex" flexDirection="column" alignItems="center" gap={3}
      width={"1000px"}
      height={"500px"}

      sx={{ border: 1 }}
    >
      <Typography variant="h4">Diseño de espacios IA</Typography>

      <Box>
        <Box>
          <Button
            variant="contained"
            component="label"
            startIcon={<CloudUploadIcon />}
          >
            Seleccione su espacio
            <input type="file" hidden onChange={handleFileChange} accept="image/*" />
          </Button>
          {loading && <CircularProgress />}
          {error && <Typography color="error">{error}</Typography>}

          <Box mt={2}
            width={"400px"} height={"200px"}
            sx={{ border: 1, borderColor: "red" }} >
            <img src={imageUrl} style={{ maxWidth: '100%', maxHeight: 800 }} />
            <Typography>Su espacio actual aqui</Typography>
          </Box>
        </Box>

        <Box>
          <Button
            variant="contained"
            component="label"
            startIcon={<CloudUploadIcon />}
          >
            Seleccione su Cobertura
            <input type="file" hidden onChange={handleFileChange} accept="image/*" />
          </Button>
          {loading && <CircularProgress />}
          {error && <Typography color="error">{error}</Typography>}

          <Box mt={2}
            width={"400px"} height={"200px"}
            sx={{ border: 1, borderColor: "red" }} >
            <img src={imageUrl} style={{ maxWidth: '100%', maxHeight: 800 }} />
            <Typography>Cobertura Seleccionada</Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default App;
