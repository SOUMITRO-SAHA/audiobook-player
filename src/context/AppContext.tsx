import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
  useEffect,
} from "react";
import axios from "axios";

const GOOGLE_BOOK_API_URL = "https://www.googleapis.com/books/v1/volumes";

export interface Book {
  id: string;
  title: string;
  authors: string[];
  coverImage: string;
  description?: string;
}

interface AppContextProps {
  searchBooks: (bookName: string) => Promise<void>;
  getTrendingBooks: () => Promise<void>;
  getBookById: (bookId: string) => Book | undefined;
  getCoverImage: (bookId: string) => string | undefined;
  searchedBooks: Book[];
  trendingBooks: Book[];
}

const initialState: AppContextProps = {
  searchBooks: async () => Promise.resolve(),
  getTrendingBooks: async () => Promise.resolve(),
  getCoverImage: () => undefined,
  getBookById: () => undefined,
  searchedBooks: [],
  trendingBooks: [],
};

const context = createContext<AppContextProps>(initialState);

const trendingBooksSubjects = [
  "trending",
  "science",
  "politics",
  "war",
  "life",
  "nature",
  "self-help",
  "philosophy",
  "psychology",
  "math",
  "finance",
  "economics",
  "history",
  "geography",
  "music",
  "art",
  "religion",
  "fiction",
  "nonfiction",
  "adventure",
  "science fiction",
  "mystery",
  "romance",
  "fantasy",
  "crime",
  "thriller",
  "children's",
  "young-adult",
  "comics",
  "graphic novels",
];

const AppContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [trendingBooks, setTrendingBooks] = useState<Book[]>([]);
  const [searchedBooks, setSearchedBooks] = useState<Book[]>([]);

  const trendingBooksTopic = useMemo(() => {
    const randomIndex = Math.floor(
      Math.random() * trendingBooksSubjects.length
    );
    return trendingBooksSubjects[randomIndex];
  }, []);

  const transformBookData = useCallback((items: any[]): Book[] => {
    return items.map((item) => ({
      id: item.id,
      title: item.volumeInfo.title || "No Title",
      authors: item.volumeInfo.authors || ["Unknown Author"],
      coverImage: item.volumeInfo.imageLinks?.thumbnail || "",
      description: item.volumeInfo.description || "No description available.",
    }));
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

  const getCoverImage = useCallback(
    (bookId: string): string | undefined => {
      const allBooks = [...searchedBooks, ...trendingBooks];
      const book = allBooks.find((b) => b.id === bookId);
      return book?.coverImage;
    },
    [searchedBooks, trendingBooks]
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
      getCoverImage,
      getBookById,
      searchedBooks,
      trendingBooks,
    }),
    [
      searchBooks,
      getTrendingBooks,
      getCoverImage,
      getBookById,
      searchedBooks,
      trendingBooks,
    ]
  );

  return <context.Provider value={values}>{children}</context.Provider>;
};

export const useAppContext = () => useContext(context);
export default AppContextProvider;
