import { useState, useContext } from 'react';
import axios from '../../services/api';
import AuthContext from '../../context/AuthContext';
import '../../styles/FarmITStyles.css';

const FarmForm = () => {
  const { user } = useContext(AuthContext);
  const [farm, setFarm] = useState({
    name: '',
    location: '',
    size: '',
    farmType: '',
    description: '',
  });
  const [images, setImages] = useState([]);
  const [fileNames, setFileNames] = useState([]); // Store file names

  const handleChange = (e) => {
    setFarm({ ...farm, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);  
    setFileNames(files.map(file => file.name)); // Store file names
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in first.');
      return;
    }

    if (!user?.isVerified) {
      alert('Your documents are not verified. You cannot register a farm.');
      return;
    }

    try {
      const formData = new FormData();
      Object.keys(farm).forEach((key) => formData.append(key, farm[key]));
      images.forEach((image) => formData.append('images', image));

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      };

      await axios.post('/farms', formData, config);
      alert('Farm registered successfully!');
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || 'Failed to register farm');
    }
  };

  return (
    <div className="upload-container">
      <div className="upload-card">
        <h2 className="upload-title">Register Your Farm</h2>
        {!user?.isVerified && (
          <p className="warning-message">Your documents are not verified. You cannot register a farm.</p>
        )}
        <form onSubmit={handleSubmit} className="upload-form">
          <input type="text" name="name" placeholder="Farm Name" onChange={handleChange} required className="upload-input" />
          <input type="text" name="location" placeholder="Location" onChange={handleChange} required className="upload-input" />
          <input type="text" name="size" placeholder="Farm Size (acres)" onChange={handleChange} required className="upload-input" />
          <input type="text" name="farmType" placeholder="Farm Type" onChange={handleChange} required className="upload-input" />
          <textarea name="description" placeholder="Description" onChange={handleChange} required className="upload-textarea" />
          
          <div className="file-input-container">
            <label htmlFor="file-upload" className="file-input-label">Upload Images</label>
            <input id="file-upload" type="file" multiple onChange={handleFileChange} className="file-input" />
            {fileNames.length > 0 && (
              <div className="file-names">
                <p>Selected File:</p>
                <ul>
                  {fileNames.map((name, index) => (
                    <li key={index}>{name}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <button type="submit" className="upload-button" disabled={!user?.isVerified}>Register Farm</button>
        </form>
      </div>
    </div>
  );
};

export default FarmForm;
