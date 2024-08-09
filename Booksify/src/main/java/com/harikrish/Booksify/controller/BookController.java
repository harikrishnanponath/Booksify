package com.harikrish.Booksify.controller;

import com.harikrish.Booksify.model.Book;
import com.harikrish.Booksify.service.BookService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.URI;
import java.nio.file.Files;
import java.nio.file.Paths;

import static com.harikrish.Booksify.constant.Constant.PHOTO_DIRECTORY;
import static org.springframework.http.MediaType.*;

@RestController
@RequestMapping("/booksify")
@RequiredArgsConstructor
public class BookController {

    @Autowired
    private BookService service;

    @PostMapping()
    public ResponseEntity<Book> createBook(@RequestBody Book book){

        return ResponseEntity.created(URI.create("/books/userID")).body(service.createBook(book));
    }

    @GetMapping()
    public ResponseEntity<Page<Book>> getBooks(@RequestParam(value = "page", defaultValue = "0") int page,
                                               @RequestParam(value = "size", defaultValue = "10") int size) {
        System.out.println("inside getbooks");
        return ResponseEntity.ok().body(service.getAllBooks(page, size));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Book> getBookById(@PathVariable("id") String id){

        return ResponseEntity.ok().body(service.getBook(id));
    }

    @PutMapping("/photo")
    public ResponseEntity<String> uploadPhoto(@RequestParam("id") String id, @RequestParam("file")MultipartFile file){

        return ResponseEntity.ok().body(service.uploadPhoto(id, file));
    }

    @GetMapping(value = "/image/{filename}", produces = {IMAGE_PNG_VALUE, IMAGE_JPEG_VALUE})
    public byte[] getPhoto(@PathVariable("filename") String filename) throws IOException {

        return Files.readAllBytes(Paths.get(PHOTO_DIRECTORY + filename));
    }

    
}
