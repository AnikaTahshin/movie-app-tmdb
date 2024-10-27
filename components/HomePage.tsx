"use client";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useState } from "react";
import { FaRegHeart, FaHeart } from "react-icons/fa";

interface MovieType {
  id: number;
  title: string;
  backdrop_path: string;
  overview: string;
  release_date: string;
  genre_ids: string[];
}

const token =
  "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2NGI0NjdmYjBlNWFiYTE0ZTRmYjdiM2U4ODllMTg0NyIsIm5iZiI6MTcyOTk0NTQ3OC40ODc2ODIsInN1YiI6IjY0MTBhZDFiZWRlMWIwMjg3ZmRhZjZkZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.1d9JxIqJRR1Y2zwLUQ-hI6qy4Ac2XVFOX-dNq7Dt0ss";

// FETCH MOVIE LIST API
const fetchMovies = async ({ pageParam = 1 }: { pageParam?: number }) => {
  const response = await fetch(
    `https://api.themoviedb.org/3/movie/popular?api_key=64b467fb0e5aba14e4fb7b3e889e1847&language=en-US&page=${pageParam}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        accept: "application/json",
      },
    }
  );
  const data = await response.json();
  return data;
};

const HomePage = ({ searchInput }: any) => {
  const [addedMovies, setAddedMovies] = useState([]);
  // INFINITE SCROLL TO SHOW MORE DATA
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["movieList"],
      queryFn: fetchMovies,
      getNextPageParam: (lastPage) => {
        if (lastPage.page < lastPage.total_pages) {
          return lastPage.page + 1;
        }
        return undefined;
      },
    });

  const searchMovieByTitle = async () => {
    const response = await fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=64b467fb0e5aba14e4fb7b3e889e1847&query=${searchInput}&include_adult=false&language=en-US`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          accept: "application/json",
        },
      }
    );
    const searchData = await response.json();

    return searchData;
  };

  const { data: searchTitleData } = useQuery({
    queryKey: ["filterData", searchInput],
    queryFn: searchMovieByTitle,
    enabled: !!searchInput,
  });

  const addToWatchList = async (movie: MovieType) => {
    if (!movie || !movie.id) {
      console.error("Movie data is missing or invalid");
      return;
    }

    let bodyData = {
      id: movie.id,
      title: movie.title,
      backdrop_path: movie.backdrop_path,
    };
    const response = await fetch("/api/watchlist", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bodyData),
    });

    const dataAdd = await response.json();
    if (dataAdd.status == 200) {
      setAddedMovies((prev: any) => [...prev, movie.id]);
    } else {
      console.error("Failed to add movie to watchlist");
    }
  };


  // const clearWatchlist = async (movie:MovieType) => {

  //   if (!movie || !movie.id) {
  //     console.error("Movie data is missing or invalid");
  //     return;
  //   }
  //   const response = await fetch('/api/watchlist', {
  //     method: 'DELETE',
  //   });
  //   const data = await response.json();
  //   return data;
  // };

  const removeFromWatchList = async (movie:MovieType) => {
    const response = await fetch(`/api/watchlist?id=${movie.id}`, {
      method: "DELETE",
    });
  
    const updatedWatchlist = await response.json();
    setAddedMovies(updatedWatchlist.map(m => m.id)); // Update state if necessary
  };
  return (
    <div>
      {/* display data searched by title */}
      {searchTitleData?.results?.length > 0 ? (
        <div className="flex flex-col items-center justify-center md:grid grid-cols-2 lg:grid-cols-4 gap-4">
          {searchTitleData.results.map((movie: MovieType) => (
            <Link
              key={movie.id}
              href={{
                pathname: `/movies/${movie.id}`,
              }}
            >
              <div className="max-w-sm relative cursor-pointer bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                <img
                  className="rounded-t-lg"
                  src={`https://image.tmdb.org/t/p/w500${movie.backdrop_path}`}
                  alt={movie.title}
                />
                <div className="p-5">
                  <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                    {movie.title}
                  </h5>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : // display home page data
      data?.pages?.length > 0 ? (
        <div className="flex flex-col items-center justify-center md:grid grid-cols-2 lg:grid-cols-4 gap-4">
          {data.pages.map((page) =>
            page.results.map((movie: MovieType) => (
              <Link
                key={movie.id}
                href={""}
                // href={{
                //   pathname: `/movies/${movie.id}`,
                // }}
              >
                {/* <div></div> */}
                <div className="max-w-sm relative cursor-pointer bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                  <div className="absolute right-2 top-2">
                    {addedMovies.includes(movie.id) ? (
                      <FaHeart onClick={() => removeFromWatchList(movie)} size={25} color="red" />
                    ) : (
                      <FaRegHeart
                        onClick={() => addToWatchList(movie)}
                        size={25}
                        color="white"
                      />
                    )}
                  </div>
                  <img
                    className="rounded-t-lg"
                    src={`https://image.tmdb.org/t/p/w500${movie.backdrop_path}`}
                    alt={movie.title}
                  />
                  <div className="p-5">
                    <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                      {movie.title}
                    </h5>
                  </div>
                </div>
              </Link>
            ))
          )}
          {hasNextPage && (
            <button
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              className="mt-4 m-auto px-4 py-2 text-white bg-blue-500 rounded"
            >
              {isFetchingNextPage ? "Loading more..." : "Load More"}
            </button>
          )}
        </div>
      ) : (
        <div>No data available</div>
      )}
    </div>
  );
};

export default HomePage;
