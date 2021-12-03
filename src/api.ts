const API_KEY = "f14a1d607a6ad37aa87c179b0018e232";
const BASE_PATH = "https://api.themoviedb.org/3";

export interface IMovie {
  id: number;
  backdrop_path: string;
  poster_path: string;
  title: string;
  overview: string;
}

export interface IGetMoviesResult {
  dates: {
    maximum: string;
    minimum: string;
  };
  page: number;
  results: [IMovie];
  total_pages: number;
  total_results: number;
}

export async function getMovies() {
  const response = await fetch(
    `${BASE_PATH}/movie/now_playing?api_key=${API_KEY}`
  );
  const ret = await response.json();
  return ret;
}
