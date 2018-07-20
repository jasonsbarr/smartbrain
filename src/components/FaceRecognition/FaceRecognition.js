import React from 'react';

const FaceRecognition = ({ imageUrl }) => {
  return (
    <div className='center ma'>
      <div className='absolute mt3'>
        <img src={imageUrl} alt='face' width='500' height='auto' />
      </div>
    </div>
  );
}

export default FaceRecognition;