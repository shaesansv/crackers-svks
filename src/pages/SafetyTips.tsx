import React from 'react';
import { Box, Typography, Paper, Container } from '@mui/material';
import { CheckCircleOutlined, HighlightOff } from '@mui/icons-material';

export const SafetyTips: React.FC = () => {
  const dos = [
    "Display fireworks as per the warnings and instructions mentioned on the pack.",
    "Buy fireworks directly from Manufacturer or from authorized dealer only.",
    "Always follow the Safety tips marked on the fireworks.",
    "Use an agarbatti to ignite the fireworks.",
    "Always wear eye protection when lightening fireworks.",
    "Keep a bucket of water or a garden hose handy in case of fire or other mishap."
  ];

  const donts = [
    "Never try to re-light or pick up fireworks that have not ignited fully.",
    "Never shoot fireworks in a metal or glass containers.",
    "Never point or throw fireworks at another person.",
    "Do not wear loose clothing while using fireworks.",
    "Never carry fireworks in your pockets.",
    "After fireworks display never pick up fireworks that may be left over, they may still active."
  ];

  return (
    <Box sx={{ width: '100%', bgcolor: '#ffffff', minHeight: '100vh', pb: 8 }}>
      {/* Hero Banner Section */}
      <Box
        sx={{
          width: '100%',
          height: { xs: '200px', md: '250px' },
          backgroundImage: 'url(/banner.png), linear-gradient(to right, #4a0000, #900000)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative'
        }}
      >
        {/* Overlay to darken background if image is present */}
        <Box sx={{ position: 'absolute', inset: 0, bgcolor: 'rgba(0,0,0,0.5)' }} />
        <Typography
          variant="h3"
          component="h1"
          sx={{
            color: 'white',
            fontWeight: 700,
            zIndex: 1,
            textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
          }}
        >
          Safety Tips
        </Typography>
      </Box>

      <Container maxWidth="lg" sx={{ mt: 6 }}>
        {/* Intro text */}
        <Box sx={{ mb: 6 }}>
          <Typography
            variant="h5"
            sx={{
              color: '#ff6f00',
              fontWeight: 700,
              mb: 2,
              fontFamily: 'sans-serif'
            }}
          >
            Sarguru Crackers
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: '#555',
              fontSize: '14px',
              lineHeight: 1.6
            }}
          >
            There are certain Do's & Don'ts to follow while purchasing, bursting and storing crackers. Thus, it is very important to follow the precautions while bursting crackers.
            <br />
            A little negligence, ignorance and carelessness can cause a fatal injury.
          </Typography>
        </Box>

        {/* Do's Section */}
        <Box sx={{ mb: 8 }}>
          <Box sx={{ borderBottom: '2px solid #eee', mb: 4, pb: 1, display: 'inline-block' }}>
            <Typography variant="h4" sx={{ color: '#333', fontWeight: 600, borderBottom: '3px solid #d32f2f', paddingBottom: '4px' }}>
              Do's
            </Typography>
          </Box>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }, gap: 4 }}>
            {dos.map((item, index) => (
              <Box key={`do-${index}`}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    height: '100%',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 2,
                    border: '1px solid #eaeaea',
                    borderRadius: '8px',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
                  }}
                >
                  <Box
                    sx={{
                      minWidth: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      bgcolor: '#f5f5f5',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <CheckCircleOutlined sx={{ color: '#4caf50' }} />
                  </Box>
                  <Typography variant="body2" sx={{ color: '#444', lineHeight: 1.5, fontSize: '13px' }}>
                    {item}
                  </Typography>
                </Paper>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Don'ts Section */}
        <Box>
          <Box sx={{ borderBottom: '2px solid #eee', mb: 4, pb: 1, display: 'inline-block' }}>
            <Typography variant="h4" sx={{ color: '#333', fontWeight: 600, borderBottom: '3px solid #d32f2f', paddingBottom: '4px' }}>
              Don'ts
            </Typography>
          </Box>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }, gap: 4 }}>
            {donts.map((item, index) => (
              <Box key={`dont-${index}`}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    height: '100%',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 2,
                    border: '1px solid #eaeaea',
                    borderRadius: '8px',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
                  }}
                >
                  <Box
                    sx={{
                      minWidth: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      bgcolor: '#f5f5f5',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <HighlightOff sx={{ color: '#d32f2f' }} />
                  </Box>
                  <Typography variant="body2" sx={{ color: '#444', lineHeight: 1.5, fontSize: '13px' }}>
                    {item}
                  </Typography>
                </Paper>
              </Box>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};
