import React, { useState } from "react";
import FoodFacilities from "./FoodFacilities";
import RedditPostGallery from "./RedditPostGallery";
import JourneyForm from "./JourneyForm";
import { JourneyContext } from "../context/JourneyContext";

const Body: React.FC<{
  showFoodFacilities: boolean;
  showRedditPosts: boolean;
}> = ({ showFoodFacilities, showRedditPosts }) => {
  const [origin, setOrigin] = useState<string>("");
  const [destination, setDestination] = useState<string>("");
  const [journeyType, setJourneyType] = useState<string>("");
  return (
    <div>
      <div>
        <JourneyContext.Provider
          value={{
            origin,
            setOrigin,
            destination,
            setDestination,
            journeyType,
            setJourneyType,
          }}
        >
          <JourneyForm />
          {showFoodFacilities && <FoodFacilities />}
        </JourneyContext.Provider>
      </div>
      {showRedditPosts && <RedditPostGallery />}
    </div>
  );
};

export default Body;
