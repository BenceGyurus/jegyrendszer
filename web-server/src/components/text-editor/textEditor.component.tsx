import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

function TextEditor() {
  const [value, setValue] = useState('<h1>Általános szerződési feltételek<h1/>');

  console.log(value);

  return <ReactQuill style={{height : "70vh"}} theme="snow" value={value} onChange={setValue} />;
}


export default TextEditor;
