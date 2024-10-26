"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";

const DetailsPage = () => {
  const token =
    "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2NGI0NjdmYjBlNWFiYTE0ZTRmYjdiM2U4ODllMTg0NyIsIm5iZiI6MTcyOTk0NTQ3OC40ODc2ODIsInN1YiI6IjY0MTBhZDFiZWRlMWIwMjg3ZmRhZjZkZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.1d9JxIqJRR1Y2zwLUQ-hI6qy4Ac2XVFOX-dNq7Dt0ss";

  const params = useParams();
  const [detailsData, setDetailsData] = useState(null);
  const [cast, setCast] = useState([])
  const [recommendedData, setRecommendedData] = useState()

  const getDetails = async () => {
    if (!params?.id) return; // Ensure there is an ID

    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${params.id}?language=en-US`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      }
    );

    const details = await response.json();
    setDetailsData(details);
  };


  const castApi = async () => {
    if (!params?.id) return; // Ensure there is an ID

    const response = await fetch(
    //   `https://api.themoviedb.org/3/movie/${params.id}?language=en-US`,
      `https://api.themoviedb.org/3/movie/${params.id}/credits?language=en-US`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      }
    );

    const castResponse = await response.json();
    setCast(castResponse);
  };

  const recommendedApi = async () => {
    if (!params?.id) return; // Ensure there is an ID

    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${params.id}/recommendations?language=en-US&page=1`,
    //   `https://api.themoviedb.org/3/movie/${params.id}/credits?language=en-US`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      }
    );

    const recomData = await response.json();
    setRecommendedData(recomData?.results);
  };


  console.log("anika cast api res",recommendedData)

  useEffect(() => {
    getDetails();
    castApi();
    recommendedApi()
  }, [params.id]);

  if (!detailsData) return <div>Loading...</div>; // Handle loading state

  return (
    <div className="max-w-sm w-full lg:max-w-full lg:flex">
      <div
        className="h-48 lg:h-auto lg:w-48 flex-none bg-cover rounded-t lg:rounded-t-none lg:rounded-l text-center overflow-hidden"
        style={{
          backgroundImage: `url(https://image.tmdb.org/t/p/w500${detailsData?.backdrop_path})`,
        }}
        title={detailsData?.title}
      ></div>
      <div className="border-r border-b border-l border-gray-400 lg:border-l-0 lg:border-t lg:border-gray-400 bg-white rounded-b lg:rounded-b-none lg:rounded-r p-4 flex flex-col justify-between leading-normal">
        <div className="mb-8">
          <p className="text-sm text-gray-600 flex items-center">
            <svg
              className="fill-current text-gray-500 w-3 h-3 mr-2"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M4 8V6a6 6 0 1 1 12 0v2h1a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-8c0-1.1.9-2 2-2h1zm5 6.73V17h2v-2.27a2 2 0 1 0-2 0zM7 6v2h6V6a3 3 0 0 0-6 0z" />
            </svg>
            Release Date: {detailsData?.release_date}
          </p>
          <div className="text-gray-900 font-bold text-xl mb-2">
            {detailsData?.title}
          </div>
          <p className="text-gray-700 text-base">{detailsData?.overview}</p>
        </div>
        <div className="flex items-center">
          <div className="text-sm">
        
            {detailsData?.genres?.map((item) => (
              <p key={item.id} className="text-gray-700">
                {item.name}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailsPage;
