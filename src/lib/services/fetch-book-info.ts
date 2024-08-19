import axios from "axios";

import { GOOGLE_BOOK_API_URL, transformBookData } from "@/constants";
import { Book } from "@/types/book";

export const getBookInfo = async (
  bookName?: string
): Promise<Book[] | undefined> => {
  try {
    const response = await axios.get(GOOGLE_BOOK_API_URL, {
      params: {
        q: bookName,
        orderBy: "relevance",
      },
    });

    const { items } = response.data;
    if (items) {
      const transformedBooks = transformBookData(items);
      const filteredBooks = transformedBooks.filter((book) => book.coverImage);

      return filteredBooks;
    }
    return undefined;
  } catch (error) {
    console.error("Error searching books:", error);
  }
};

type BookInfoType = {
  coverImage: string | null;
  authors: string[] | null;
  albumName: string | null;
};

export const fetchBookInfo = async (
  bookName: string
): Promise<BookInfoType | undefined> => {
  const bookInfoResponse: BookInfoType = {
    coverImage: null,
    authors: null,
    albumName: null,
  };

  try {
    const bookInfo = await getBookInfo(bookName);

    if (bookInfo && bookInfo.length > 0) {
      const relevantInfo = bookInfo.find(
        (info) => !info?.authors?.includes("Unknown")
      );

      if (relevantInfo) {
        bookInfoResponse.coverImage = relevantInfo.coverImage;
        bookInfoResponse.authors = relevantInfo.authors;
        bookInfoResponse.albumName = relevantInfo.title;
      }

      return bookInfoResponse;
    }
  } catch (error) {
    console.error("Error fetching book info:", error);
    throw error;
  }
};
