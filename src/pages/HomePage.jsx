import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/styles/HomePage.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPhone, 
  faUserPlus, 
  faAddressBook, 
  faHome,
  faPlus,
  faEye
} from '@fortawesome/free-solid-svg-icons';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <header className="home-header">
        <h1>
          {/* <FontAwesomeIcon icon={faPhone} className="title-icon" /> */}
          +ContactBook
        </h1>
        <p className="subtitle">Manage your contacts efficiently and effortlessly</p>
      </header>

      <div className="cards-container">
      <div className="contact-card" onClick={() => navigate('/contacts')}>
          <div className="card-icon-container">
            <FontAwesomeIcon icon={faAddressBook} className="card-icon" />
          </div>
          <h2>View Contacts</h2>
          <p>Browse and manage your saved contacts</p>
          <button className="card-button">
            <FontAwesomeIcon icon={faEye} className="button-icon" />
            View All
          </button>
        </div>
        <div className="contact-card" onClick={() => navigate('/create')}>
          <div className="card-icon-container">
            <FontAwesomeIcon icon={faUserPlus} className="card-icon" />
          </div>
          <h2 >Add Contact</h2>
          <p>Create a new contact entry with all necessary details</p>
          <button className="card-button">
            <FontAwesomeIcon icon={faPlus} className="button-icon" />
            Add New
          </button>
        </div>

        
      </div>

      <footer className="home-footer">
        <FontAwesomeIcon icon={faHome} className="footer-icon" />
        <p>Your personal contact management solution</p>
      </footer>
    </div>
  );
};

export default HomePage;