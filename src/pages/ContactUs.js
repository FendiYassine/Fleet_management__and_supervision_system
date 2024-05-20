import React, { useState } from 'react';

const Contact = () => {
  const [contactInfo, setContactInfo] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setContactInfo(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically handle the submission, e.g., sending data to a backend server
    console.log('Submitting contact form', contactInfo);
    alert('Thank you for your message!');
    // Reset form (optional)
    setContactInfo({ name: '', email: '', message: '' });
  };

  return (
    <div className="container">
      <h2>Contact Us</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={contactInfo.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={contactInfo.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="message">Message:</label>
          <textarea
            id="message"
            name="message"
            value={contactInfo.message}
            onChange={handleChange}
            required
          />
        </div>
		<center>
        <button type="submit" className="btn btn-primary">Send</button>
		</center>
      </form>
    </div>
  );
};

export default Contact;
