"use client";
import { useInfiniteQuery } from "@tanstack/react-query";
import Link from "next/link";

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

// FETCH MOVIE API
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

const HomePage = () => {

  // console.log("getting from homepage",inputSearch)
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

  // GET MOVIE GENRE
  // const movieGenreApi = async () => {
  //   const response = await fetch(
  //     "https://api.themoviedb.org/3/genre/movie/list?language=en"
  //   );
  //   const genreData = await response.json();
  //   return genreData;
  // };

  // const searchMovieByTitle = async (  text :string) => {
  //   const response = await fetch(
  //     `https://api.themoviedb.org/3/search/movie?api_key=64b467fb0e5aba14e4fb7b3e889e1847&${text}`,
  //     {
  //       headers: {
  //         "Authorization": `Bearer ${token}`,
  //         "accept": "application/json",
  //       },
  //     }
  //   );
  //   const searchData = await response.json();
  //   return searchData;
  // };

  // const { data: genre } = useQuery({
  //   queryKey: ["genre"],
  //   queryFn: movieGenreApi,
  // });

  // RENDER GENRE NAME IN HOME PAGE
  // const renderGenre = (idArr: any) => {
  //   return genre?.genres
  //     ?.filter((genreItem: any) => idArr.includes(genreItem.id))
  //     .map((matchedGenre: any) => matchedGenre.name)
  //     .join(", ");
  // };

  return (
    <div>
      {data?.pages ? (
        <div className="grid grid-cols-4 gap-4">
          {data.pages.map((page) =>
            page.results.map((movie: MovieType) => (
              <Link
              key={movie?.id} // Ensure unique key for each Link
              href={{
                pathname: `/movies/${movie?.id}`, // Use movie.id dynamically
              }}
              >
                <div
                  key={movie?.id}
                  className="max-w-sm cursor-pointer bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
                >
                  <img
                    className="rounded-t-lg"
                    src={`https://image.tmdb.org/t/p/w500${movie?.backdrop_path}`}
                    alt={movie?.title}
                  />
                  <div className="p-5">
                    <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                      {movie?.title}
                    </h5>
                    {/* <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                      {movie?.overview}
                    </p> */}
                    

                    {/* <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                      {movie?.release_date}
                    </p> */}
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
