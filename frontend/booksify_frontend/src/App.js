
import { useEffect, useRef, useState } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { getBooks, saveBook, updateBook, updatePhoto } from './api/BookService';
import Header from './components/Header'
import BookList from './components/BookList'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import BookDetail from './components/BookDetail';
import { toastError } from './api/ToastService';
import { ToastContainer } from 'react-toastify';
import NavBar from './components/NavBar';
import About from './components/About';
import Contact from './components/Contact';

function App() {

  const noHeaderRoutes = ['/about', '/contact'];

  const location = useLocation();

  const modalRef = useRef();
  const fileRef = useRef()
  const [data, setData] = useState({});
  const [currentPage, setCurrentPage] = useState(0);
  const [file, setFile] = useState(undefined);
  const [values, setValues] = useState({
    name: '',
    author: '',
    genre: ''
  });

  const getAllBooks = async (page = 0, size = 12) => {
    try {

      setCurrentPage(page);
      const { data } = await getBooks(page, size);
      setData(data);
      console.log(data);
    }
    catch (error) {
      console.log(error)
      toastError(error.message);
    }
  }

  const onChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };


  const handleNewBook = async (event) => {
    event.preventDefault();
    try {

      const { data } = await saveBook(values);
      const formData = new FormData();
      formData.append('file', file, file.name);
      formData.append('id', data.id);
      const { data: photoUrl } = await updatePhoto(formData);
      toggleModal(false);
      setFile(undefined);
      fileRef.current.value = null;
      setValues({
        name: '',
        author: '',
        genre: ''
      })
      getAllBooks();
    } catch (error) {

      console.log(error);
      toastError(error.message);

    }
  };

  const updateBook = async (book) => {
    try {
      const { data } = await saveBook(book);
      console.log(data);
    } catch (error) {
      console.log(error);
      toastError(error.message);
    }
  };
  const updateImage = async (formData) => {
    try {
      const { data: photoUrl } = await updatePhoto(formData);
    } catch (error) {
      console.log(error);
      toastError(error.message);
    }
  };

  const toggleModal = (show) => {
    show ? modalRef.current.showModal() : modalRef.current.close();
  }

  useEffect(() => {
    getAllBooks();
  }, []);

  return (
    <>
      <NavBar />
      {!noHeaderRoutes.includes(location.pathname) && (
        <Header toggleModal={toggleModal} nbOfBooks={data.totalElements} />
      )}
      
      <main className='main'>
        
        <div className="container">
          <Routes>
            <Route path='/' element={<Navigate to={'/booksify'} />} />
            <Route path="/booksify" element={<BookList data={data} currentPage={currentPage} getAllBooks={getAllBooks} />} />
            <Route path="/booksify/:id" element={<BookDetail updateBook={updateBook} updateImage={updateImage} />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </div>
      </main>

      {/* Modal */}
      <dialog ref={modalRef} className="modal" id="modal">
        <div className="modal__header">
          <h3>New Book</h3>
          <i onClick={() => toggleModal(false)} className="bi bi-x-lg"></i>
        </div>
        <div className="divider"></div>
        <div className="modal__body">
          <form onSubmit={handleNewBook}>
            <div className="user-details">
              <div className="input-box">
                <span className="details">Book Name</span>
                <input type="text" value={values.name} onChange={onChange} name='name' required />
              </div>
              <div className="input-box">
                <span className="details">Author</span>
                <input type="text" value={values.author} onChange={onChange} name='author' required />
              </div>
              <div className="input-box">
                <span className="details">Genre</span>
                <input type="text" value={values.genre} onChange={onChange} name='genre' required />
              </div>
              <div className="file-input">
                <span className="details">Cover Photo</span>
                <input type="file" onChange={(event) => setFile(event.target.files[0])} ref={fileRef} name='photo' required />
              </div>
            </div>
            <div className="form_footer">
              <button onClick={() => toggleModal(false)} type='button' className="btn btn-danger">Cancel</button>
              <button type='submit' className="btn">Save</button>
            </div>
          </form>
        </div>
      </dialog>
      <ToastContainer />
    </>
  );
}

export default App;
