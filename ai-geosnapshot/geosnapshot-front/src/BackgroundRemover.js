import React, { useState } from 'react';

const BackgroundRemover = () => {
  const [image, setImage] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
    setProcessedImage(null);
  };

  const handleRemoveBackground = async () => {
    if (!image) return;

    const formData = new FormData();
    formData.append('image', image);

    const response = await fetch('http://127.0.0.1:5000/remove_background', {
      method: 'POST',
      body: formData
    });

    const blob = await response.blob();
    const imgUrl = URL.createObjectURL(blob);
    setProcessedImage(imgUrl);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Background Remover</h2>
      <input type="file" accept="image/*" onChange={handleImageChange} />
      <br />
      <button onClick={handleRemoveBackground}>Remove Background</button>
      <br /><br />
      {processedImage && (
        <div>
          <h3>Result:</h3>
          <img src={processedImage} alt="Processed" style={{ maxWidth: '400px' }} />
          <br />
          <a href={processedImage} download="bg_removed.png">Download</a>
        </div>
      )}
    </div>
  );
};

export default BackgroundRemover;
