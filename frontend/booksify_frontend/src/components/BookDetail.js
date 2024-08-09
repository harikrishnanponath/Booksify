import React, { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom';
import { getBook } from '../api/BookService';
import { toastError, toastSuccess } from '../api/ToastService';

const BookDetail = ({ updateBook, updateImage }) => {

    const inputRef = useRef();
    const [book, setBook] = useState({
        name: '',
        author: '',
        genre: '',
        photoUrl: ''
    });

    const { id } = useParams();
    console.log(id);

    const fetchBook = async (event) => {
        try {
            const { data } = await getBook(id);
            setBook(data);
        } catch (error) {

            console.log(error)

        }
    };

    const selectImage = () => {
        inputRef.current.click();
    };

    const udpatePhoto = async (file) => {
        try {
            const formData = new FormData();
            formData.append('file', file, file.name);
            formData.append('id', id);
            await updateImage(formData);
            setBook((prev) => ({ ...prev, photoUrl: `${prev.photoUrl}?updated_at=${new Date().getTime()}` }));
            toastSuccess('Photo updated');
        } catch (error) {
            console.log(error);
            toastError(error.message);
        }
    };

    const onChange = (event) => {
        setBook({ ...book, [event.target.name]: event.target.value });
    };

    const onUpdateBook = async (event) => {
        event.preventDefault();
        await updateBook(book);
        fetchBook(id);
        toastSuccess('Book Updated');
    };

    useEffect(() => {
        fetchBook(id);
    }, []);


    return (
        <>
            <Link to={'/booksify'} className='link'><i className='bi bi-arrow-left'></i> Back to list</Link>
            <div className='profile'>
                <div className='profile__details'>
                    <img src={book.photoUrl} alt={`Profile photo of ${book.name}`} />

                    <p className='book_name'>{book.name}</p>
                    <p className="book_author">{book.author}</p>
                    <p><i>{book.genre}</i></p>
                </div>
            </div>
            <div className='profile__settings'>
                <div>
                    <form onSubmit={onUpdateBook} className="form">
                        <div className="user-details">
                            <input type="hidden" defaultValue={book.id} name="id" required />
                            <div className="input-box">
                                <span className="details">Name</span>
                                <input type="text" value={book.name} onChange={onChange} name="name" required />
                            </div>
                            <div className="input-box">
                                <span className="details">Author</span>
                                <input type="text" value={book.author} onChange={onChange} name="author" required />
                            </div>
                            <div className="input-box">
                                <span className="details">Genre</span>
                                <input type="text" value={book.genre} onChange={onChange} name="genre" required />
                            </div>
                            <div className='profile__metadata'>
                                
                                <p className='profile__muted'>JPG, GIF, or PNG. Max size of 10MB</p>
                                <button onClick={selectImage} className='btn'><i className='bi bi-cloud-upload'></i> Change Photo</button>
                            </div>
                        </div>
                        <div className="form_footer">
                            <button type="submit" className="btn">Save</button>
                        </div>
                    </form>
                </div>
            </div>


            <form style={{ display: 'none' }}>
                <input type='file' ref={inputRef} onChange={(event) => udpatePhoto(event.target.files[0])} name='file' accept='image/*' />
            </form>
        </>
    )
}

export default BookDetail