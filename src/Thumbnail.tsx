import React from 'react';
import './Thumbnail.css';

export type ThumbnailProps = {
    index: number,
}

const Thumbnail = ({index} : ThumbnailProps) => {
  return (
    <div className="Thumbnail">
      This is a Thumbnail with index {index}
    </div>
  );
}

export default Thumbnail;
