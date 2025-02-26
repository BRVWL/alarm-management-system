import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardMedia, 
  CardContent, 
  Dialog, 
  IconButton,
  Paper
} from '@mui/material';
import { X } from 'lucide-react';
import { VisualizationResponseDto } from '../../api';
import { getVisualizationUrl } from '../../utils/api';

interface VisualizationGalleryProps {
  visualizations: VisualizationResponseDto[];
}

const VisualizationGallery: React.FC<VisualizationGalleryProps> = ({ visualizations }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  if (!visualizations || visualizations.length === 0) {
    return (
      <Paper elevation={2} sx={{ p: 3, borderRadius: 2, textAlign: 'center' }}>
        <Typography variant="body1" color="text.secondary">
          No visualizations available for this alarm.
        </Typography>
      </Paper>
    );
  }

  const handleImageClick = (imagePath: string) => {
    setSelectedImage(imagePath);
  };

  const handleClose = () => {
    setSelectedImage(null);
  };

  return (
    <>
      <Grid container spacing={2}>
        {visualizations.map((visualization) => (
          <Grid item xs={12} sm={6} md={4} key={visualization.id}>
            <Card 
              elevation={2} 
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                cursor: 'pointer',
                '&:hover': {
                  boxShadow: 6
                },
                borderRadius: 2
              }}
              onClick={() => handleImageClick(getVisualizationUrl(visualization.path))}
            >
              <CardMedia
                component="img"
                height="200"
                image={getVisualizationUrl(visualization.path)}
                alt={`Visualization ${visualization.id}`}
                sx={{ objectFit: 'cover' }}
              />
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  Uploaded: {new Date(visualization.uploadedAt).toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog
        open={!!selectedImage}
        onClose={handleClose}
        maxWidth="lg"
        fullWidth
      >
        <Box sx={{ position: 'relative' }}>
          <IconButton
            sx={{ position: 'absolute', right: 8, top: 8, color: 'white', bgcolor: 'rgba(0,0,0,0.3)' }}
            onClick={handleClose}
          >
            <X size={24} />
          </IconButton>
          {selectedImage && (
            <img
              src={selectedImage}
              alt="Visualization"
              style={{ width: '100%', display: 'block' }}
            />
          )}
        </Box>
      </Dialog>
    </>
  );
};

export default VisualizationGallery; 