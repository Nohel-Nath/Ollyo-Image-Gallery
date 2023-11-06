import React, { useRef, useState } from "react";
import "./Gallery.css";

function Home() {
  const [data, setData] = useState([]);
  const [image, setImage] = useState([]);
  const [imagePreview, setImagePreview] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [selectedImageCount, setSelectedImageCount] = useState(0);
  const [featureImageIndex, setFeatureImageIndex] = useState(0);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newImages = [];
    const newPreviews = [];

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          newPreviews.push(reader.result);
          newImages.push(file);

          // Directly append the preview to the 'data' state
          const updatedData = [...data, reader.result];
          setData(updatedData);
        }
      };
      reader.readAsDataURL(file);
    });

    // Update the state with the new images (not necessary for automatic display)
    setImage(newImages);
  };

  const hiddenFileInput = useRef(null);
  const handleClick = (event) => {
    hiddenFileInput.current.click();
    setData([...data, ...imagePreview]);
    // Clear the selected image and preview
    setImage([]);
    setImagePreview([]); // ADDED
  };

  const handleImageSelect = (index) => {
    let updatedSelectedImages;

    if (selectedImages.includes(index)) {
      updatedSelectedImages = selectedImages.filter((item) => item !== index);
    } else {
      updatedSelectedImages = [...selectedImages, index];
    }

    setSelectedImages(updatedSelectedImages);
    setSelectedImageCount(updatedSelectedImages.length);
  };

  const handleDeleteImages = () => {
    const updatedData = data.filter(
      (_, index) => !selectedImages.includes(index)
    );
    setData(updatedData);
    // Clear the selected images and update the count
    setSelectedImages([]);
    setSelectedImageCount(0);
  };

  //Drag and Drop
  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const dragImageIndex = event.dataTransfer.getData("imageIndex");
    const dropImageIndex = event.target.dataset.index;

    // Update data state based on drag and drop indexes
    const updatedData = [...data];
    const draggedImage = updatedData[dragImageIndex];
    updatedData.splice(dragImageIndex, 1);
    updatedData.splice(dropImageIndex, 0, draggedImage);
    setData(updatedData);
  };

  const handleDragStart = (event) => {
    event.dataTransfer.setData("imageIndex", event.target.dataset.index);
  };

  return (
    <div>
      <div className="hello">
        <div className="part">
          {selectedImageCount === 0 ? (
            <div style={{ fontWeight: "bold", marginLeft: "10px" }}>
              Gallery
            </div>
          ) : (
            <div style={{ fontWeight: "bold" }}>
              <input type="checkbox" checked={true} />
              {selectedImageCount === 1
                ? "1 file selected"
                : `${selectedImageCount} files selected`}
              <button className="delete-button" onClick={handleDeleteImages}>
                Delete Files
              </button>
            </div>
          )}
        </div>
        <div
          className="my-grid"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          {data.length > 0 &&
            data.map((preview, index) => (
              <div
                key={index}
                className={`my-image ${
                  featureImageIndex === index ? "featured-image" : ""
                }`}
              >
                <div className="image-checkbox-container">
                  <input
                    type="checkbox"
                    className="image-checkbox"
                    checked={selectedImages.includes(index)}
                    onChange={() => handleImageSelect(index)}
                  />
                </div>

                {index === 0 ? (
                  <div className="task">
                    <img
                      className="featured-image-class"
                      src={preview}
                      alt=""
                      draggable
                      onDragStart={handleDragStart}
                      data-index={index}
                    />
                  </div>
                ) : (
                  <div className="task1">
                    <img
                      className="my-rounded-xl"
                      src={preview}
                      alt=""
                      draggable
                      onDragStart={handleDragStart}
                      data-index={index}
                    />
                  </div>
                )}
              </div>
            ))}
          <div className="my-button">
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
              ref={hiddenFileInput}
              style={{ display: "none" }}
            />
            <button onClick={handleClick}>Add Images</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
