import React from 'react';
import { Card, CardContent, Typography, IconButton, Avatar, Box } from '@mui/material';
import '../assets/styles/ContactCard.css'
import { Edit, Delete, Phone, Email, Home, People } from '@mui/icons-material';
const ContactCard = ({ contact, onEdit, onDelete }) => {
  const relationIcons = {
    Family: '👨‍👩‍👧‍👦',
    Friend: '👫',
    Colleague: '👔',
    Acquaintance: '🙂',
    Other: '👤'
  };

  // Construct the full image URL
  const getImageUrl = () => {
    if (!contact.photo) return 'https://i.pravatar.cc/150?img=3';
    if (contact.photo.startsWith('http')) return contact.photo;
    if (contact.photo.startsWith('data:image')) return contact.photo;
    return `http://localhost:5000${contact.photo}`;
  };

  // Handle phone click (initiate call)
  const handlePhoneClick = (phoneNumber) => {
    window.location.href = `tel:${phoneNumber}`;
  };

  // Handle email click (open email client)
  const handleEmailClick = (emailAddress) => {
    window.location.href = `mailto:${emailAddress}`;
  };

  return (
    <Card sx={{
      minWidth: 350,
      margin: 2,
      borderRadius: '12px',
      boxShadow: ' rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px;',
      transition: 'transform 0.3s, box-shadow 0.3s',
      '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
      }
    }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar 
              src={getImageUrl()} 
              sx={{ width: 56, height: 56, mr: 2 }}
              alt={contact.name}
            />
            <Box>
              <Typography variant="h6" component="div">
                {contact.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                <People sx={{ fontSize: 16, mr: 0.5 }} />
                {contact.relation} {relationIcons[contact.relation]}
              </Typography>
            </Box>
          </Box>
          <Box>
            <IconButton onClick={() => onEdit(contact)} color="primary">
              <Edit />
            </IconButton>
            <IconButton onClick={() => onDelete(contact._id)} color="error">
              <Delete />
            </IconButton>
          </Box>
        </Box>
        
        <Box sx={{ mt: 2 }}>
          {/* Clickable Phone Number */}
          <Typography 
            variant="body2" 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              mb: 1,
              cursor: 'pointer',
              '&:hover': {
                textDecoration: 'underline',
                color: 'primary.main'
              }
            }}
            onClick={() => handlePhoneClick(contact.phone)}
          >
            <Phone sx={{ mr: 1, color: 'primary.main' }} />
            {contact.phone}
          </Typography>

          {/* Clickable Email */}
          <Typography 
            variant="body2" 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              mb: 1,
              cursor: 'pointer',
              '&:hover': {
                textDecoration: 'underline',
                color: 'primary.main'
              }
            }}
            onClick={() => handleEmailClick(contact.email)}
          >
            <Email sx={{ mr: 1, color: 'primary.main' }} />
            {contact.email}
          </Typography>

          {/* Address (not clickable) */}
          <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
            <Home sx={{ mr: 1, color: 'primary.main' }} />
            {contact.address}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ContactCard;