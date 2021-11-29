import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";

const Wrapper = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Box = styled(motion.div)`
  width: 200px;
  height: 100px;
  background-color: white;
  border-radius: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 32px;
  box-shadow: 0px 2px 3px rgba(0, 0, 0, 0.1), 0px 10px 20px rgba(0, 0, 0, 0.06);
`;

const boxVariants = {
  initial: {
    x: 800,
    opacity: 0,
    scale: 0,
  },
  animate: {
    x: 0,
    opacity: 1,
    scale: 1,
  },
  exit: {
    x: -800,
    opacity: 0,
    scale: 0,
  },
};

const Button = styled.button`
  position: absolute;
`;

function App() {
  const [index, setIndex] = useState(1);
  const rightPlease = () => setIndex((prev) => (prev === 10 ? 1 : prev + 1));
  const leftPlease = () => setIndex((prev) => (prev === 1 ? 10 : prev - 1));
  return (
    <Wrapper>
      <Button onClick={leftPlease} style={{ left: "50px" }}>
        left
      </Button>
      <AnimatePresence>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) =>
          i === index ? (
            <Box
              variants={boxVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ type: "tween", duration: 1 }}
              key={i}
            >
              {i}
            </Box>
          ) : null
        )}
      </AnimatePresence>
      <Button onClick={rightPlease} style={{ right: "50px" }}>
        right
      </Button>
    </Wrapper>
  );
}

export default App;
