import { Book } from "@/types/book";

export const DEFAULT_DATABASE_NAME: string = "audiobook.db";
export const DEFAULT_RADIUS: number = 0.25;
export const DEFAULT_FOLDER_NAME: string = "Audiobooks";
export const EXTERNAL_DIRECTORY_URL = "file:///storage/emulated/0/";
export const DEFAULT_AUDIOBOOK_FOLDER_URI = `${EXTERNAL_DIRECTORY_URL}/${DEFAULT_FOLDER_NAME}`;
export const GOOGLE_BOOK_API_URL =
  "https://www.googleapis.com/books/v1/volumes";

export const trendingBooksSubjects = [
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

export const transformBookData = (items: any[]): Book[] => {
  return items.map((item) => ({
    id: item.id,
    title: item.volumeInfo.title || "No Title",
    authors: item.volumeInfo.authors || ["Unknown Author"],
    coverImage: item.volumeInfo.imageLinks?.thumbnail || "",
    description: item.volumeInfo.description || "No description available.",
  }));
};
