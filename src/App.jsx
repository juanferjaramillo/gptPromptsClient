import React, { useState } from 'react';
import { Box, Grid, Typography, Button, CircularProgress } from '@mui/material';
import ImageUpload from './dumbComps/ImageUpload';
import ImagePreview from './dumbComps/ImagePreview';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import axios from "axios";
const serverUrl = import.meta.env.VITE_SERVER_URL;
const clientKey = import.meta.env.VITE_CLIENT_KEY;
const prompt = import.meta.env.VITE_PROMPT;

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
      prompt: prompt,
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
    <Grid display="flex"
      flexDirection="column"
      maxWidth="100vw"
      p={4} alignItems="center" gap={3}
    >

      <Typography variant="h4">Diseño de espacios IA</Typography>
{/*
      <Grid display="flex" flexDirection="row"
        wrap='wrap'
        gap={4}
        border={1}
      >
        <Grid>
          <ImageUpload label="Seleccione su espacio" onChange={(e) => handleImageChange(e, 'space')} loading={loading} error={error} />
          <ImagePreview src={spaceUrl} title="Su espacio actual aquí" />
        </Grid>
        <Grid>
          <ImageUpload label="Seleccione su Cobertura" onChange={(e) => handleImageChange(e, 'tile')} loading={loading} error={error} />
          <ImagePreview src={tileUrl} title="Cobertura Seleccionada" />
        </Grid>
      </Grid>
*/}

<Grid container spacing={4}>
  <Grid item xs={12} md={6}>
    <ImageUpload
      label="Seleccione su espacio"
      onChange={(e) => handleImageChange(e, 'space')}
      loading={loading}
      error={error}
    />
    <ImagePreview src={spaceUrl} title="Su espacio actual aquí" />
  </Grid>

  <Grid item xs={12} md={6}>
    <ImageUpload
      label="Seleccione su Cobertura"
      onChange={(e) => handleImageChange(e, 'tile')}
      loading={loading}
      error={error}
    />
    <ImagePreview src={tileUrl} title="Cobertura Seleccionada" />
  </Grid>
</Grid>


      {loading && <CircularProgress />}

      <Grid mt={"5%"}>
        <Button variant="contained" component="label" startIcon={<CloudUploadIcon />}
          onClick={handleDisenar}
        >Muestrame mi nuevo piso!</Button>
        <ImagePreview src={resImage} title="Su nuevo diseño aquí" />
      </Grid>

    </Grid>
  );
};

export default App;
