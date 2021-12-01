import { AnimatePresence, motion } from "framer-motion";
import { useQuery } from "react-query";
import styled from "styled-components";
import { getMovies, IGetMoviesResult } from "../api";
import { makeImgPath } from "../utils";
import { useState } from "react";

const Wrapper = styled.div`
  background-color: black;
`;

const Banner = styled.div<{ bgPhoto: string }>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.8)),
    url(${(props) => makeImgPath(props.bgPhoto)});
  background-size: cover; ;
`;

const Title = styled.h2`
  font-size: 60px;
  margin-bottom: 30px;
`;

const Overview = styled.p`
  font-size: 30px;
  width: 60%;
`;

const Slider = styled.div`
  position: relative;
  top: -60px;
`;

const Row = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 5px;
  position: absolute;
  width: 100%;
`;

const Box = styled(motion.div)<{
  boxHeight: number;
  boxWidth: number;
  bgImage: string;
}>`
  background-color: white;
  height: ${(props) => `${props.boxHeight}px`};
  background-image: url(${(props) => makeImgPath(props.bgImage, "w500")});
  background-size: cover;
  background-position: center center;
  color: red;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 30px;
`;

const rowVariants = {
  initial: {
    x: window.outerWidth + 5,
  },
  animate: {
    x: 0,
  },
  exit: {
    x: -window.outerWidth - 5,
  },
};

const offset = 6;

function Home() {
  const { data, isLoading } = useQuery<IGetMoviesResult>(
    ["movies", "nowPlaying"],
    getMovies
  );
  const boxWidth = (window.outerWidth - 25) / 6;
  const boxHeight = boxWidth / 1.6;
  const [index, setIndex] = useState(0);
  const [isRowLeaving, setIsRowLeaving] = useState(false);
  const toggleIsRowLeaving = () => setIsRowLeaving((prev) => !prev);
  const incIndex = () => {
    if (data) {
      const totalMoviesLength = data.results.length - 1;
      const maxPageIndex = Math.ceil(totalMoviesLength / offset) - 1;
      if (isRowLeaving) return;
      toggleIsRowLeaving();
      setIndex((prev) => (prev === maxPageIndex ? 0 : prev + 1));
    }
  };
  if (isLoading) return null;
  return (
    <Wrapper style={{ width: "100vw", height: "200vh" }}>
      <Banner onClick={incIndex} bgPhoto={data?.results[0].backdrop_path || ""}>
        <Title>{data?.results[0].title}</Title>
        <Overview>{data?.results[0].overview}</Overview>
      </Banner>
      <Slider>
        <AnimatePresence initial={false} onExitComplete={toggleIsRowLeaving}>
          <Row
            key={index}
            variants={rowVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 1, type: "tween" }}
          >
            {data?.results
              .slice(1)
              .slice(offset * index, offset * index + offset)
              .map((movie) => (
                <Box
                  key={movie.id}
                  boxHeight={boxHeight}
                  boxWidth={boxWidth}
                  bgImage={movie.backdrop_path}
                />
              ))}
          </Row>
        </AnimatePresence>
      </Slider>
    </Wrapper>
  );
}

export default Home;
