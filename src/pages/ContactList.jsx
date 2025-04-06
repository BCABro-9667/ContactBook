import React, { useState, useEffect } from "react";
import axios from "axios";
import "../assets/styles/ContactList.css";
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  CircularProgress,
  IconButton,
  InputAdornment,
  Pagination,
} from "@mui/material";
import { Add, Search } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ContactCard from "../components/ContactCard";

const ContactList = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const contactsPerPage = 9;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/contacts", {
          params: { search: searchTerm },
        });
        setContacts(response.data);
      } catch (error) {
        console.error("Error fetching contacts:", error);
        toast.error("Failed to load contacts");
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchContacts();
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/contacts/${id}`);
      setContacts(contacts.filter((contact) => contact._id !== id));
      toast.success("Contact deleted successfully!");
    } catch (error) {
      console.error("Error deleting contact:", error);
      toast.error("Failed to delete contact");
    }
  };

  // Calculate paginated contacts
  const indexOfLastContact = page * contactsPerPage;
  const indexOfFirstContact = indexOfLastContact - contactsPerPage;
  const currentContacts = contacts.slice(
    indexOfFirstContact,
    indexOfLastContact
  );
  const totalPages = Math.ceil(contacts.length / contactsPerPage);

  return (
    <Box className="list-container" sx={{ p: 3 }}>
      <div className="top-nav">
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 4,
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Typography
            className="heading"
            variant="h4"
            sx={{ fontWeight: "bold", color: "primary.main" }}
          >
            +ContactBook
          </Typography>

          <Box
            sx={{
              display: "flex",
              gap: 2,
              flexWrap: "wrap",
              width: { xs: "100%", sm: "auto" },
            }}
          >
            <TextField
              placeholder="Search contacts..."
              variant="outlined"
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{
                minWidth: 250,
                "& .MuiOutlinedInput-root": {
                  borderRadius: "20px",
                  backgroundColor: "background.paper",
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search color="action" />
                  </InputAdornment>
                ),
              }}
            />

            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => navigate("/create")}
              sx={{
                borderRadius: "20px",
                textTransform: "none",
                px: 3,
                boxShadow: "0 2px 10px rgba(25, 118, 210, 0.3)",
              }}
            >
              Add Contact
            </Button>
          </Box>
        </Box>
      </div>
      <hr className="divider" />
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : contacts.length === 0 ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "50vh",
            textAlign: "center",
          }}
        >
          <Typography variant="h6" sx={{ mb: 2 }}>
            {searchTerm ? "No contacts found" : "No contacts yet"}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            {searchTerm
              ? "Try a different search term"
              : "Click the button above to add your first contact"}
          </Typography>
          {!searchTerm && (
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => navigate("/create")}
              sx={{ borderRadius: "20px", px: 3 }}
            >
              Add Contact
            </Button>
          )}
        </Box>
      ) : (
        <>
          <Grid container spacing={3}>
            {currentContacts.map((contact) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={contact._id}>
                <ContactCard
                  contact={contact}
                  onEdit={() => navigate(`/edit/${contact._id}`)}
                  onDelete={handleDelete}
                />
              </Grid>
            ))}
          </Grid>
          {totalPages > 1 && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={(event, value) => setPage(value)}
                color="primary"
                shape="rounded"
              />
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default ContactList;
