import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const flaskURL = 'http://localhost:5001';

function HomePage() {
  const [images, setImages] = useState([]);
  const [file, setFile] = useState(null);

  const fetchImages = async () => {
    const res = await axios.get(`${flaskURL}/images`);
    setImages(res.data);
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append('image', file);
    await axios.post(`${flaskURL}/upload`, formData);
    setFile(null);
    fetchImages();
  };

  return (
    <div className="container fade-in">
      <h1 className="title">GeoSnapShot Photo Editor</h1>
      <div className="file-upload">
        <label className="file-upload-label">
          Choose Image
          <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        </label>
      </div>
      <br />
      <Link to="/cutout">
        <button style={{ marginTop: '1rem' }}>Try Group Photo Cutout</button>
      </Link>
      <button onClick={handleUpload} className="upload-btn">Upload Image</button>
      <div className="gallery-container">
        {images.map(name => (
          <div key={name} className="image-box">
            <img src={`${flaskURL}/uploads/${name}`} alt={name} />
            <Link to={`/editor/${name}`}>
              <button className="edit-btn">Edit</button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HomePage;

