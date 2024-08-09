import axios from "axios";

const API_URL = "http://localhost:8080/booksify";

export async function saveBook(book){
    return await axios.post(API_URL, book);
}

export async function getBooks(page = 0, size = 12){
    return await axios.get(`${API_URL}?page=${page}&size=${size}`);
}

export async function getBook(id){
    return await axios.get(`${API_URL}/${id}`);
}

export async function updateBook(book){
    return await axios.post(API_URL, book);
}

export async function updatePhoto(formData){
    return await axios.put(`${API_URL}/photo`, formData);
}

export async function deleteBook(id){
    return await axios.delete(`${API_URL}/${id}`);
}