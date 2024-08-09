package com.harikrish.Booksify.service;

import com.harikrish.Booksify.model.Book;
import com.harikrish.Booksify.repo.BookRepo;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Optional;
import java.util.function.BiFunction;
import java.util.function.Function;

import static com.harikrish.Booksify.constant.Constant.PHOTO_DIRECTORY;
import static java.nio.file.StandardCopyOption.REPLACE_EXISTING;

@Service
@Slf4j
@Transactional(rollbackOn = Exception.class)
@RequiredArgsConstructor
public class BookService {

    @Autowired
    private final BookRepo bookRepo;

    public Page<Book> getAllBooks(int page, int size) {
        return bookRepo.findAll(PageRequest.of(page, size, Sort.by("name")));
    }

    public Book getBook(String id) {
        return bookRepo.findById(id).orElseThrow(() -> new RuntimeException("Book not found"));
    }

    public Book createBook(Book book) {
        return bookRepo.save(book);
    }

    public void deleteBook(Book book){

    }

    public String uploadPhoto(String id, MultipartFile file){
        Book book = getBook(id);
        String photoUrl = photoFunction.apply(id, file);
        book.setPhotoUrl(photoUrl);
        bookRepo.save(book);
        return photoUrl;
    }

    private final Function<String, String> fileExtension = filename -> Optional.of(filename).filter(name -> name.contains("."))
            .map(name -> "." + name.substring(filename.indexOf(".") + 1)).orElse(".png");

    private BiFunction<String, MultipartFile, String> photoFunction = (id, image) -> {

        String fileName = id + fileExtension.apply(image.getOriginalFilename());
        try{

            Path fileStorageLocation = Paths.get(PHOTO_DIRECTORY).toAbsolutePath().normalize();
            if (!Files.exists(fileStorageLocation)){
                Files.createDirectories(fileStorageLocation);
            }

            Files.copy(image.getInputStream(), fileStorageLocation.resolve(fileName), REPLACE_EXISTING);
            return ServletUriComponentsBuilder.fromCurrentContextPath().path("/booksify/image/"+fileName).toUriString();
        }
        catch (Exception e){
            throw new RuntimeException("Unable to upload the image");

        }
    };
}
