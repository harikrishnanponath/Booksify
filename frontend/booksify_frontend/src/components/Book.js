import React from 'react'
import { Link } from 'react-router-dom'

const Book = ({ book }) => {
    return (
      <Link to={`/booksify/${book.id}`} className='book_item' aria-label={`View details for ${book.name}`}>
          <div className='book_header'>
              <div className='book_image'>
                  <img src={book.photoUrl} alt={`Cover image of ${book.name}`} />
              </div>
              <div className="book_details">
                  <p className='book_name'>{book.name}</p>
                  <p className="book_author">{book.author}</p>
                  <p><i>{book.genre}</i></p>
              </div>
          </div>
      </Link>
    );
  };
  

export default Book