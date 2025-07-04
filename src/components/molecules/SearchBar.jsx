import React from 'react'
import Input from '@/components/atoms/Input'

const SearchBar = ({ value, onChange, placeholder = 'Search...', className = '' }) => {
  return (
    <div className={`max-w-md ${className}`}>
      <Input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        icon="Search"
        iconPosition="left"
      />
    </div>
  )
}

export default SearchBar