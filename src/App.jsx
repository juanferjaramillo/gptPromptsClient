import React, { useState } from 'react';
import { Box, Grid, Typography, Button, CircularProgress } from '@mui/material';
import ImageUpload from './dumbComps/ImageUpload';
import ImagePreview from './dumbComps/ImagePreview';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import axios from "axios";
const serverUrl = import.meta.env.VITE_SERVER_URL;
const clientKey = import.meta.env.VITE_CLIENT_KEY;

const App = () => {
  const [spaceUrl, setSpaceUrl] = useState(null);
  const [tileUrl, setTileUrl] = useState(null);
  const [resImage, setResImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


  //------------------------------------------------------------------
  const cloudinaryUpload = async (file, folder) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'sthemma_img_preset');
    formData.append('folder', folder);

    //const url = URL.createObjectURL(file);

    try {
      const res = await fetch('https://api.cloudinary.com/v1_1/sthemma/image/upload', {
        method: 'POST',
        body: formData
      });

      const data = await res.json();
      if (data.secure_url) {
        return data.secure_url;
      } else {
        throw new Error('Upload failed');
      }
    } catch (err) {
      throw new Error(err.message || 'An error occurred during upload');
    }
  };

  //-------------------------------------------------------------------------
  const handleImageChange = async (event, type) => {
    const file = event.target.files[0];
    if (!file) return;

    setLoading(true);
    setError(null);

    try {
      const url = await cloudinaryUpload(file, 'callisto/design');
      if (type === 'space') setSpaceUrl(url);
      else setTileUrl(url);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  //----------------------------------------------------------------------
  async function handleDisenar() {
    const body = {
      imageUrl1: spaceUrl,
      imageUrl2: tileUrl,
      prompt: "Replace the floor on the room in the image with the tiles in the second image.  Keep all objects in the same place.",
      clientKey: clientKey
    }
    console.log("sending request to OpenAI");
    setLoading(true);
    const resImage = await axios.post(`${serverUrl}sendImagePrompt/`, body);
    setLoading(false);
    console.log("result image url: ", resImage.data);
    resImage ? setResImage(resImage.data) : console.log("error getting the resulting image");
  }

  //----------------------------------------------------------------

  return (
    <Box p={4} display="flex" flexDirection="column" alignItems="center" gap={3} width="1000px" height="700px" sx={{ border: 1 }}>
      {loading && <CircularProgress />}
      <Typography variant="h4">Diseño de espacios IA</Typography>
      <Grid display="flex" justifyContent="space-between" gap={4}>
        <Box>
          <ImageUpload label="Seleccione su espacio" onChange={(e) => handleImageChange(e, 'space')} loading={loading} error={error} />
          <ImagePreview src={spaceUrl} title="Su espacio actual aquí" />
        </Box>
        <Box>
          <ImageUpload label="Seleccione su Cobertura" onChange={(e) => handleImageChange(e, 'tile')} loading={loading} error={error} />
          <ImagePreview src={tileUrl} title="Cobertura Seleccionada" />
        </Box>
      </Grid>
      <Grid mt={"5%"}>
        <Button variant="contained" component="label" startIcon={<CloudUploadIcon />}
          onClick={handleDisenar}
        >Diseñar el nuevo espacio</Button>
        <ImagePreview src={resImage} title="Su nuevo diseño aquí" />
      </Grid>
    </Box>
  );
};

export default App;
