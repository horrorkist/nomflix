import { AnimatePresence, motion, useViewportScroll } from "framer-motion";
import { useQuery } from "react-query";
import styled from "styled-components";
import { getMovies, IGetMoviesResult } from "../api";
import { makeImgPath } from "../utils";
import { useState } from "react";
import { useMatch, useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { isInBigBox } from "../atom";

const Wrapper = styled.div<{ isInBigBox: Boolean }>`
  background-color: black;
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: auto;
`;

const Banner = styled.div<{ bgPhoto: string }>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 50px;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
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
`;

const Row = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 5px;
  position: absolute;
  width: 100%;
  padding: 0px 50px;
`;

interface IBox {
  boxHeight: number;
  boxWidth: number;
  bgImage: string;
}

const Box = styled(motion.div)<IBox>`
  border-radius: 5px;
  background-color: white;
  height: ${(props) => `${props.boxHeight}px`};
  background-image: url(${(props) => makeImgPath(props.bgImage, "w500")});
  background-size: cover;
  background-position: center center;
  display: flex;
  justify-content: center;
  align-items: center;

  div {
    width: ${(props) => `${props.boxWidth}px`};
    top: ${(props) => `${props.boxHeight}px`};
    background-color: ${(props) => props.theme.black.lighter};
  }
  &:hover div {
    opacity: 1;
    transition: opacity 0.3s ease 0.5s;
    z-index: 99;
  }
`;

const Info = styled(motion.div)`
  opacity: 0;
  padding: 10px;
  position: absolute;
  z-index: -99;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
  transition: opacity 0.3s ease;
`;

const Overlay = styled(motion.div)`
  background-color: rgba(0, 0, 0, 0.5);
  height: 100vh;
  position: fixed;
  left: 0;
  right: 0;
  opacity: 0;
  z-index: 100;
  overflow-y: scroll;
`;

const BigBox = styled(motion.div)`
  width: 60vw;
  margin: 0 auto;
  margin-top: 50px;
  border-radius: 10px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background-color: ${(props) => props.theme.black.lighter};
`;

const BigBoxText = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 15px;
  h3 {
    font-size: 24px;
    margin-bottom: 15px;
  }
  p {
    flex-grow: 1;
  }
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

const boxVariants = {
  initial: {},
  hover: {
    y: -50,
    scale: 1.3,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    transition: {
      type: "tween",
      delay: 0.5,
      duration: 0.3,
    },
  },
};

function Home() {
  const { data, isLoading } = useQuery<IGetMoviesResult>(
    ["movies", "nowPlaying"],
    getMovies
  );
  const navigate = useNavigate();
  const bigBoxMatch = useMatch("/movie/:movieId");
  const clickedMovie =
    bigBoxMatch?.params.movieId &&
    data?.results.find((movie) => movie.id + "" === bigBoxMatch.params.movieId);
  const boxWidth = (window.outerWidth - 25 - 100) / 6;
  const boxHeight = boxWidth / 1.6;
  const [index, setIndex] = useState(0);
  const [isRowLeaving, setIsRowLeaving] = useState(false);
  const setInBox = useSetRecoilState(isInBigBox);
  const onBoxClicked = (url: string) => {
    setInBox(true);
    navigate(url);
  };
  const onOverlayClick = () => {
    setInBox(false);
    navigate(-1);
  };
  const toggleIsRowLeaving = () => setIsRowLeaving((prev) => !prev);
  const incIndex = () => {
    if (data) {
      const totalMoviesLength = data.results.length - 1;
      const maxPageIndex = Math.floor(totalMoviesLength / offset) - 1;
      if (isRowLeaving) return;
      toggleIsRowLeaving();
      setIndex((prev) => (prev === maxPageIndex ? 0 : prev + 1));
    }
  };

  if (isLoading) return null;

  return (
    <Wrapper style={{ width: "100vw" }} isInBigBox={bigBoxMatch ? true : false}>
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
              .map((movie, index) => (
                <Box
                  layoutId={movie.id + ""}
                  onClick={() => onBoxClicked(`/movie/${movie.id}`)}
                  variants={boxVariants}
                  initial="initial"
                  whileHover="hover"
                  transition={{ type: "tween" }}
                  key={movie.id}
                  boxHeight={boxHeight}
                  boxWidth={boxWidth}
                  bgImage={movie.backdrop_path}
                  style={{ originX: index === 0 ? 0 : index === 5 ? 1 : 0.5 }}
                >
                  <Info key={movie.id}>
                    <h3>{movie.title}</h3>
                  </Info>
                </Box>
              ))}
          </Row>
        </AnimatePresence>
      </Slider>
      <AnimatePresence>
        {bigBoxMatch ? (
          <Overlay
            onClick={onOverlayClick}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <BigBox layoutId={bigBoxMatch.params.movieId}>
              {clickedMovie && (
                <>
                  <img
                    width="100%"
                    src={`${makeImgPath(clickedMovie.backdrop_path)}`}
                    alt=""
                  />
                  <BigBoxText>
                    <h3>{clickedMovie.title}</h3>
                    <p>{clickedMovie.overview}</p>
                    <p>{clickedMovie.overview}</p>
                    <p>{clickedMovie.overview}</p>
                    <p>{clickedMovie.overview}</p>
                    <p>{clickedMovie.overview}</p>
                  </BigBoxText>
                </>
              )}
            </BigBox>
          </Overlay>
        ) : null}
      </AnimatePresence>
    </Wrapper>
  );
}

export default Home;
