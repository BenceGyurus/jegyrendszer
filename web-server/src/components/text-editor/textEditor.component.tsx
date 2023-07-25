import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

type typeOfEditTextEditorParams = {
    value : string,
    onChangeFunction : any
};

function TextEditor({value, onChangeFunction}:typeOfEditTextEditorParams) {


  return (<ReactQuill style={{height : 300, width : "80%", marginLeft : "auto", marginRight : "auto", marginTop : 20}} theme="snow" value={value} onChange={onChangeFunction} />);
}


export default TextEditor;
