import React from 'react'

function Header({ toggleModal, nbOfBooks}) {
  return (
    <div className="header">
      <div className="container">
        <h3>Book List ({ nbOfBooks })</h3>
        <button onClick={()=> toggleModal(true)} className='btn'>
          Add new Book    
        </button>
      </div>
    </div>
  )
}

export default Header