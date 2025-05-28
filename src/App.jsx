// App.jsx
import { useState } from 'react';
import { Box, Grid, Button, Typography, CircularProgress } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { Cloudinary } from '@cloudinary/url-gen';
import { auto } from '@cloudinary/url-gen/actions/resize';
import { autoGravity } from '@cloudinary/url-gen/qualifiers/gravity';
import { AdvancedImage } from '@cloudinary/react';


function App() {
  const [SpaceUrl, setSpaceUrl] = useState(null);
  const [TileUrl, setTileUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  //---------------------------------------------------

  const cloudinaryLoad = async (event) => {
    const files = event.target.files;
    const formData = new FormData();
    const uploadEndpoint =
      "https://api.cloudinary.com/v1_1/sthemma/image/upload/";
    setLoader(true);
    try {
      for (let key in files) {
        if (typeof files[key] === "object") {
          formData.set("file", files[key]);
          formData.set("upload_preset", "sthemma_img_preset");
          formData.set("folder", `callisto/design`);
          const response = await axios.post(uploadEndpoint, formData);
          toast.success("Imagenes cargadas con éxito");
        }
      }
      event.target.value = null;
      console.log("update image ok");
    } catch (error) {
      console.log(`Adminproducts error ${error}`);
      toast.error("Error cargando imagenes");
    }
    setLoader(false);
  };

  //--------------------------------------------------------  
  const handleSpaceChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
   formData.append("upload_preset", "sthemma_img_preset");
    formData.append("folder", `callisto/design`);

    setLoading(true);
    setError(null);

    const url = URL.createObjectURL(file);
    setSpaceUrl(url);

    
    try {
      const res = await fetch('https://api.cloudinary.com/v1_1/sthemma/image/upload', {
        method: 'POST',
        body: formData
      });

      const data = await res.json();
      if (data.secure_url) {
        setSpaceUrl(data.secure_url);
      } else {
        setError('Upload failed');
      }
    } catch (err) {
      setError('An error occurred during upload', err.message);
    } finally {
      setLoading(false);
    }
    

    //const spaceURL = cloudinaryLoad(file);
    //console.log("space", spaceURL);
    //setLoading(false);
    
  };

  //----------------------------------------------------------------
  const handleTileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'your_upload_preset'); // Replace with your Cloudinary upload preset

    setLoading(true);
    setError(null);

    const url = URL.createObjectURL(file);
    setTileUrl(url);

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
      height={"700px"}

      sx={{ border: 1 }}
    >
      <Typography variant="h4">Diseño de espacios IA</Typography>

      <Grid
        display={"flex"}
        justifyContent={"space-between"}
      >
        <Box>
          <Button
            variant="contained"
            component="label"
            startIcon={<CloudUploadIcon />}
          >
            Seleccione su espacio
            <input type="file" hidden onChange={handleSpaceChange} accept="image/*" />
          </Button>
          {loading && <CircularProgress />}
          {error && <Typography color="error">{error}</Typography>}

          <Box mt={2}
            width={"300px"} height={"200px"}
            sx={{ border: 1, borderColor: "red" }} >
            <img src={SpaceUrl} style={{ maxWidth: "300px", maxHeight: "200px" }} />
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
            <input type="file" hidden onChange={handleTileChange} accept="image/*" />
          </Button>
          {loading && <CircularProgress />}
          {error && <Typography color="error">{error}</Typography>}

          <Grid mt={2}

            sx={{ border: 1, borderColor: "red" }} >
            <img src={TileUrl} style={{ maxWidth: "300px", maxHeight: "200px" }} />
            <Typography>Cobertura Seleccionada</Typography>
          </Grid>
        </Box>
      </Grid>
      <Button
        variant="contained"
        component="label"
        startIcon={<CloudUploadIcon />}
      >
        Diseñar el nuevo espacio
      </Button>

      <Box mt={2}
        width={"300px"} height={"200px"}
        sx={{ border: 1, borderColor: "red" }} >
        <img src={null} style={{ maxWidth: "300px", maxHeight: "200px" }} />
        <Typography>Su nuevo diseño aqui</Typography>
      </Box>
    </Box>
  );
}

export default App;


