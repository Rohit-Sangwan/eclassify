import React from 'react';
import Image from 'next/image';
import { IoCloseCircleOutline } from "react-icons/io5";

const ImageViewer = ({ src, alt, onClose }) => {
  return (
    <div className="image-viewer-overlay" onClick={onClose}>
      <div className="image-viewer-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>
          <IoCloseCircleOutline size={30} />
        </button>
        <Image src={src} alt={alt} layout="fill" objectFit="contain" />
      </div>
    </div>
  );
};

export default ImageViewer;