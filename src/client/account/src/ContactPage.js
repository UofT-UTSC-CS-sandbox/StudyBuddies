import React from 'react';
import './ContactPage.css';

const ContactPage = () => {
  const contact = {
    name: 'John Doe',
    phone: '(555) 123-4567',
    email: 'johndoe@example.com',
    address: '123 Apple St, Cupertino, CA'
  };

  return (
    <div className="contact-page">
      <div className="header">
        <h1>Contact</h1>
      </div>
      <div className="contact-info">
        <div className="avatar">
          <img src="https://via.placeholder.com/150" alt="Avatar" />
        </div>
        <div className="details">
          <h2>{contact.name}</h2>
          <p><strong>Phone:</strong> {contact.phone}</p>
          <p><strong>Email:</strong> {contact.email}</p>
          <p><strong>Address:</strong> {contact.address}</p>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
