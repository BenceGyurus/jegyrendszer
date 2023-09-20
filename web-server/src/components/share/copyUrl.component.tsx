import React, { useState } from 'react';


type typeOfCopyUrlParams = {
    urlToCopy : string
}

const CopyUrl = ({ urlToCopy }:typeOfCopyUrlParams) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyClick = () => {
    const textArea = document.createElement('textarea');
    textArea.value = urlToCopy;

    // Ensure it's not displayed
    textArea.style.position = 'fixed';
    textArea.style.top = '0';
    textArea.style.left = '0';
    textArea.style.opacity = '0';

    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);

    setIsCopied(true);
  };

  return (
    <div>
      <button onClick={handleCopyClick}>
        {isCopied ? 'URL Copied!' : 'Copy URL'}
      </button>
    </div>
  );
};

export default CopyUrl;
