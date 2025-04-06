import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../assets/styles/ContactForm.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faEye
} from '@fortawesome/free-solid-svg-icons';

import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Select, 
  MenuItem, 
  InputLabel, 
  FormControl, 
  Avatar,
  Paper,
  Stack
} from '@mui/material';
import { Save, Cancel, CloudUpload } from '@mui/icons-material';
import axios from 'axios';
import { toast } from 'react-toastify';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    relation: 'Friend',
    photo: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      const fetchContact = async () => {
        try {
          const response = await axios.get(`https://contactbook-backend-i42d.onrender.com/api/contacts/${id}`);
          setFormData({
            name: response.data.name,
            phone: response.data.phone,
            email: response.data.email,
            address: response.data.address,
            relation: response.data.relation,
            photo: response.data.photo
          });
        } catch (error) {
          console.error('Error fetching contact:', error);
          toast.error('Failed to load contact');
        }
      };
      fetchContact();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (!/^[a-zA-Z\s]+$/.test(formData.name)) {
      newErrors.name = 'Name should contain only letters';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required';
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = 'Phone must be 10 digits';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.address.trim()) newErrors.address = 'Address is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
  
    setIsLoading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('phone', formData.phone);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('address', formData.address);
      formDataToSend.append('relation', formData.relation);
      
      if (formData.photoFile) {
        formDataToSend.append('photo', formData.photoFile);
      } else if (formData.photo && !formData.photo.startsWith('data:')) {
        formDataToSend.append('photo', formData.photo);
      }
  
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      };
  
      if (id) {
        await axios.put(`https://contactbook-backend-i42d.onrender.com/api/contacts/${id}`, formDataToSend, config);
        toast.success('Contact updated successfully!');
      } else {
        await axios.post('https://contactbook-backend-i42d.onrender.com/api/contacts', formDataToSend, config);
        toast.success('Contact created successfully!');
      }
      navigate('/');
    } catch (error) {
      console.error('Error saving contact:', error);
      toast.error('Failed to save contact');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
  
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData({
        ...formData,
        photo: reader.result,
        photoFile: file
      });
    };
    reader.readAsDataURL(file);
  };

  return (
    <>
      <div className="heading-container">
        <div className="heading"><h2>Add Contacts</h2></div>
        <div className="navigations-"></div>
        <button className='view-btn' onClick={() => navigate("/")}>            
          <FontAwesomeIcon icon={faEye} className="view-icon" />
         View Contact</button>
      </div>
      <hr className="divider" />

      <Paper elevation={3} sx={{ 
        p: 4, 
        maxWidth: 500, 
        mx: 'auto', 
        mt: 4,
        borderRadius: 2
      }}>
        <Typography 
          variant="h4" 
          component="h1" 
          align="center" 
          
          gutterBottom
          sx={{ fontWeight: 'bold', mb: 4, fontFamily: 'Poppins, sans-serif' }}
          >
          {id ? 'Edit Contact' : 'Create New Contact'}
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={3} alignItems="center">
            {/* Photo Upload */}
            <Box sx={{ position: 'relative' }}>
              <Avatar
                src={formData.photo || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'}
                sx={{ 
                  width: 150, 
                  height: 150, 
                  border: '3px solid #1976d2',
                  mb: 2
                }}
              />
              <Button
                variant="contained"
                component="label"
                startIcon={<CloudUpload />}
                sx={{
                  position: 'absolute',
                  bottom: 10,
                  right: 10,
                  borderRadius: '50%',
                  minWidth: 'auto',
                  padding: '10px',
                  backgroundColor: '#1976d2',
                  '&:hover': {
                    backgroundColor: '#1565c0'
                  }
                }}
              >
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleImageUpload}
                />
              </Button>
            </Box>

            {/* Name */}
            <TextField
              fullWidth
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={!!errors.name}
              helperText={errors.name}
              variant="outlined"
              sx={{ maxWidth: 400 }}
              inputProps={{
                pattern: "[a-zA-Z\\s]*",
                title: "Name should contain only letters"
              }}
            />

            {/* Phone and Email */}
            <Box sx={{ 
              display: 'flex', 
              gap: 2, 
              width: '100%',
              maxWidth: 400
            }}>
              <TextField
                fullWidth
                label="Mobile Number"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                error={!!errors.phone}
                helperText={errors.phone}
                variant="outlined"
                inputProps={{
                  pattern: "\\d{10}",
                  title: "Phone must be 10 digits"
                }}
              />
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
                variant="outlined"
              />
            </Box>

            {/* Address */}
            <TextField
              fullWidth
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              error={!!errors.address}
              helperText={errors.address}
              variant="outlined"
              multiline
              rows={3}
              sx={{ maxWidth: 400 }}
            />

            {/* Relation */}
            <FormControl fullWidth sx={{ maxWidth: 400 }}>
              <InputLabel>Relationship</InputLabel>
              <Select
                name="relation"
                value={formData.relation}
                onChange={handleChange}
                label="Relationship"
              >
                <MenuItem value="Family">Family</MenuItem>
                <MenuItem value="Friend">Friend</MenuItem>
                <MenuItem value="Colleague">Colleague</MenuItem>
                <MenuItem value="Acquaintance">Acquaintance</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
            </FormControl>

            {/* Buttons */}
            <Box sx={{ 
              display: 'flex', 
              gap: 2, 
              width: '100%',
              justifyContent: 'center',
              mt: 2
            }}>
              <Button
                variant="outlined"
                startIcon={<Cancel />}
                onClick={() => navigate('/')}
                sx={{ px: 4 }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                startIcon={<Save />}
                disabled={isLoading}
                sx={{ px: 4 }}
              >
                {isLoading ? 'Saving...' : 'Save'}
              </Button>
            </Box>
          </Stack>
        </Box>
      </Paper>
    </>
  );
};

export default ContactForm;