import axios from "axios";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  GOOGLE_BOOK_API_URL,
  transformBookData,
  trendingBooksSubjects,
} from "@/constants";
import { Book } from "@/types/book";

interface AppContextProps {
  searchBooks: (bookName: string) => Promise<void>;
  getTrendingBooks: () => Promise<void>;
  getBookById: (bookId: string) => Book | undefined;
  getBookInfo: (bookName: string) => Promise<Book[] | undefined>;
  searchedBooks: Book[];
  trendingBooks: Book[];
}

const initialState: AppContextProps = {
  searchBooks: async () => Promise.resolve(),
  getTrendingBooks: async () => Promise.resolve(),
  getBookInfo: () => Promise.resolve(undefined),
  getBookById: () => undefined,
  searchedBooks: [],
  trendingBooks: [],
};

const context = createContext<AppContextProps>(initialState);

const AppContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [trendingBooks, setTrendingBooks] = useState<Book[]>([]);
  const [searchedBooks, setSearchedBooks] = useState<Book[]>([]);

  const trendingBooksTopic = useMemo(() => {
    const randomIndex = Math.floor(
      Math.random() * trendingBooksSubjects.length
    );
    return trendingBooksSubjects[randomIndex];
  }, []);

  const searchBooks = useCallback(
    async (bookName: string) => {
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
          const filteredBooks = transformedBooks.filter(
            (book) => book.coverImage
          );
          setSearchedBooks(filteredBooks);
        }
      } catch (error) {
        console.error("Error searching books:", error);
      }
    },
    [transformBookData]
  );

  const getTrendingBooks = useCallback(async () => {
    try {
      const response = await axios.get(GOOGLE_BOOK_API_URL, {
        params: {
          q: `subject:${trendingBooksTopic}`,
          orderBy: "relevance",
          maxResults: 10,
        },
      });

      const { items } = response.data;
      if (items) {
        const transformedBooks = transformBookData(items);
        setTrendingBooks(transformedBooks);
      }
    } catch (error) {
      console.error("Error fetching trending books:", error);
    }
  }, [trendingBooksTopic, transformBookData]);

  const getBookInfo = useCallback(
    async (bookName?: string): Promise<Book[] | undefined> => {
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
          const filteredBooks = transformedBooks.filter(
            (book) => book.coverImage
          );

          return filteredBooks;
        }
        return undefined;
      } catch (error) {
        console.error("Error searching books:", error);
      }
    },
    [transformBookData]
  );

  const getBookById = useCallback(
    (bookId: string): Book | undefined => {
      const allBooks = [...searchedBooks, ...trendingBooks];
      return allBooks.find((b) => b.id === bookId);
    },
    [searchedBooks, trendingBooks]
  );

  useEffect(() => {
    getTrendingBooks();
  }, [getTrendingBooks]);

  const values = useMemo(
    () => ({
      searchBooks,
      getTrendingBooks,
      getBookInfo,
      getBookById,
      searchedBooks,
      trendingBooks,
    }),
    [
      searchBooks,
      getTrendingBooks,
      getBookInfo,
      getBookById,
      searchedBooks,
      trendingBooks,
    ]
  );

  return <context.Provider value={values}>{children}</context.Provider>;
};

export const useAppContext = () => useContext(context);
export default AppContextProvider;
