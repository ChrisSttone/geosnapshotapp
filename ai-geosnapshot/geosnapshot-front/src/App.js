// src/App.js
import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [outputImage, setOutputImage] = useState(null);
  const [cutouts, setCutouts] = useState([]);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setOutputImage(null);
    setCutouts([]);
  };

  const handleBackgroundRemove = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      const response = await axios.post('http://127.0.0.1:5000/remove_background', formData, {
        responseType: 'blob',
      });

      const imageBlob = new Blob([response.data], { type: 'image/png' });
      const imageUrl = URL.createObjectURL(imageBlob);
      setOutputImage(imageUrl);
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const handleGenerateCutouts = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      const response = await axios.post('http://127.0.0.1:5000/generate_cutouts', formData);
      const images = response.data.cutouts; // list of base64 strings
      setCutouts(images);
    } catch (err) {
      console.error('Error:', err);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>GeoSnapshot Editor</h2>
      <input type="file" accept="image/*" onChange={handleFileChange} />

      <div style={{ marginTop: '1rem' }}>
        <button onClick={handleBackgroundRemove}>Remove Background</button>
        <button onClick={handleGenerateCutouts} style={{ marginLeft: '1rem' }}>
          Generate Cutouts
        </button>
      </div>

      {outputImage && (
        <div style={{ marginTop: '2rem' }}>
          <h4>Background Removed:</h4>
          <img src={outputImage} alt="Output" style={{ maxWidth: '100%' }} />
          <a href={outputImage} download="output.png">Download</a>
        </div>
      )}

      {cutouts.length > 0 && (
        <div style={{ marginTop: '2rem' }}>
          <h4>Detected Cutouts:</h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
            {cutouts.map((cutout, index) => (
              <div key={index}>
                <img
                  src={`data:image/png;base64,${cutout}`}
                  alt={`cutout-${index}`}
                  style={{ maxWidth: '200px', border: '1px solid #ccc' }}
                />
                <a
                  href={`data:image/png;base64,${cutout}`}
                  download={`cutout-${index + 1}.png`}
                >
                  Download
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
