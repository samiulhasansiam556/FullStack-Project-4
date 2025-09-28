'use client'
import React from 'react'
import { useContext } from 'react'
import MyContext from '@/context/MyContext'

const page = () => {

    const context = useContext(MyContext)
   if (!context) {
    throw new Error('SearchComponent must be used within MyState');
  }

  const { search, setSearch } = context;
  return (
    <div>
      {search}
    </div>
  )
}

export default page
