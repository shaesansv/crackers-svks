import React from 'react';
import { Box, Typography, Container } from '@mui/material';
import { PlaceOutlined, CallOutlined, PublicOutlined, Facebook, Map } from '@mui/icons-material';

export const ContactUs: React.FC = () => {
  return (
    <Box sx={{ width: '100%', bgcolor: '#ffffff', minHeight: '100vh', pb: 0 }}>
      {/* Hero Banner Section */}
      <Box
        sx={{
          width: '100%',
          height: { xs: '250px', md: '350px' },
          backgroundImage: 'url(/banner.png), linear-gradient(to right, #900000, #d32f2f, #900000)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* We rely on the background image or gradient for the visual */}
      </Box>

      <Container maxWidth="lg" sx={{ mt: 8, mb: 8, textAlign: 'center' }}>
        {/* Title */}
        <Box sx={{ mb: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography
            variant="h4"
            sx={{
              color: '#333',
              fontWeight: 700,
              fontFamily: 'serif', // matching the serif look in the image
              letterSpacing: '1px'
            }}
          >
            CONTACT US
          </Typography>
          <Box sx={{ width: '60px', height: '3px', bgcolor: '#ff6f00', mt: 2 }} />
        </Box>

        {/* Contact Info Grid */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' }, gap: 4 }}>
          {/* Address */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Box
              sx={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                border: '1px solid #eaeaea',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 3,
                boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
              }}
            >
              <PlaceOutlined sx={{ color: '#ff6f00', fontSize: 30 }} />
            </Box>
            <Typography variant="h6" sx={{ color: '#333', fontWeight: 600, mb: 2 }}>
              Address
            </Typography>
            <Typography variant="body2" sx={{ color: '#555', lineHeight: 1.8 }}>
              Sarguru Crackers
              <br />
              3/1321 Paraipatti, Sivakasi
            </Typography>
          </Box>

          {/* Phone */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Box
              sx={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                border: '1px solid #eaeaea',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 3,
                boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
              }}
            >
              <CallOutlined sx={{ color: '#ff6f00', fontSize: 30 }} />
            </Box>
            <Typography variant="h6" sx={{ color: '#333', fontWeight: 600, mb: 2 }}>
              Phone
            </Typography>
            <Typography variant="body2" sx={{ color: '#555', lineHeight: 1.8 }}>
              Mobile: +91 78680 77818
            </Typography>
          </Box>

          {/* Connect With Us */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Box
              sx={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                border: '1px solid #eaeaea',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 3,
                boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
              }}
            >
              <PublicOutlined sx={{ color: '#ff6f00', fontSize: 30 }} />
            </Box>
            <Typography variant="h6" sx={{ color: '#333', fontWeight: 600, mb: 2 }}>
              Connect With Us
            </Typography>
            <Typography variant="body2" sx={{ color: '#555', lineHeight: 1.8, mb: 2 }}>
              jvkkumar1100@gmail.com
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Facebook sx={{ color: '#3b5998', fontSize: 30, cursor: 'pointer' }} />
              <Map sx={{ color: '#db4437', fontSize: 30, cursor: 'pointer' }} />
            </Box>
          </Box>
        </Box>
      </Container>

      {/* Map Section */}
      <Box sx={{ width: '100%', height: '400px', bgcolor: '#e0e0e0', mt: 8 }}>
        <iframe
          title="Sarguru Crackers Location"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15740.063230674205!2d77.7845!3d9.4534!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b06cee43b811239%3A0x8e83be6ab31668e1!2sSivakasi%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1689332014120!5m2!1sen!2sin"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen={false}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </Box>
    </Box>
  );
};
