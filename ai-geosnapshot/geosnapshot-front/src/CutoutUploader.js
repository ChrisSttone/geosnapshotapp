// src/CutoutUploader.js
import React, { useState } from 'react';
import axios from 'axios';

const CutoutUploader = () => {
  const [image, setImage] = useState(null);
  const [cutouts, setCutouts] = useState([]);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!image) return alert("Please select an image");

    const formData = new FormData();
    formData.append("image", image);

    try {
      const res = await axios.post("http://127.0.0.1:5000/cutout_people", formData, {
        responseType: 'json',
      });

      // Cutouts will be a list of base64 strings
      setCutouts(res.data.cutouts);
    } catch (err) {
      console.error(err);
      alert("Failed to cut out people");
    }
  };

  return (
    <div style={{ marginTop: '30px' }}>
      <h2>Cut Out People from Group Photo</h2>
      <input type="file" accept="image/*" onChange={handleImageChange} />
      <button onClick={handleUpload}>Cut Out People</button>

      <div style={{ marginTop: '20px' }}>
        {cutouts.map((cutout, index) => (
          <img
            key={index}
            src={`data:image/png;base64,${cutout}`}
            alt={`Cutout ${index}`}
            style={{ width: '200px', margin: '10px' }}
          />
        ))}
      </div>
    </div>
  );
};

export default CutoutUploader;
