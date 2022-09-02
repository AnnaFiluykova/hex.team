import React from 'react';

import './style.css';

interface IProps {
  fixed?: boolean
}

const Loader = ({ fixed }: IProps) => {
  if(fixed) {
    return (
      <div className='loader__wrapper'>
        <div className='loader' />
      </div>
    );
  }

  return (
    <div className='loader' />
  );
}

export default Loader;
