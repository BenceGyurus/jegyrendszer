import React, { useState } from 'react';
import "../../css/search.css";
import { AccountBookFilled, ControlFilled, ControlOutlined, FileSearchOutlined, MacCommandOutlined, SearchOutlined } from '@ant-design/icons';
import Search from 'antd/es/input/Search';

function SearchField() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleInputChange = (e:any) => {
    //
  };


  return (
    <div className="search-container">
        <div>
      <div className="search-icon">
      <SearchOutlined color='#a3a3a3' style={{color : "#a3a3a3"}} />
      </div>
      <input
        type="text"
        className="search-input-class"
        placeholder="Keresés..."
        onChange={handleInputChange}
      />
      <div className={`clear-icon ${searchQuery ? 'show' : ''}`}>
        <span style={{ color : "#a3a3a3" }}>⌘K</span>
      </div>
      </div>
    </div>
  );
}

export default SearchField;
