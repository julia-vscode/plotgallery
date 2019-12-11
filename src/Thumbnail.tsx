import React from 'react';
import './Thumbnail.css';

export type ThumbnailProps = {
    index: number,
    onClick: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void,
    thumbnailURL: string | null,
    selected: boolean,
}

const Thumbnail = ({index, onClick, thumbnailURL, selected} : ThumbnailProps) => {
  return (
    <div className="Thumbnail" onClick={onClick}>
      <div className="column left">{index + 1}</div>
      <div className="column right">
        {thumbnailURL && <img src={thumbnailURL} className={selected ? "thumbnail-image-selected" : "thumbnail-image"} alt="" />}
      </div>
    </div>
  );
}

export default Thumbnail;
