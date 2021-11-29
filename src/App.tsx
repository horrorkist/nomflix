import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";

const Wrapper = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const BoxWrapper = styled.div`
  width: 600px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 20px;
  div:first-child,
  div:last-child {
    grid-column: span 2;
  }
`;

const Box = styled(motion.div)`
  height: 150px;
  background-color: white;
  border-radius: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 12px;
  box-shadow: 0px 2px 3px rgba(0, 0, 0, 0.1), 0px 10px 20px rgba(0, 0, 0, 0.06);
`;

const Overlay = styled(motion.div)`
  width: 100vw;
  height: 100vh;
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const OverlayVariants = {
  initial: {
    backgroundColor: "rgba(0, 0, 0, 0)",
  },
  animate: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  exit: {
    backgroundColor: "rgba(0, 0, 0, 0.0)",
  },
};

function App() {
  const [id, setId] = useState<string | null>(null);
  return (
    <Wrapper>
      <BoxWrapper>
        {[1, 2, 3, 4].map((id) => {
          return <Box layoutId={id + ""} onClick={() => setId(id + "")}></Box>;
        })}
      </BoxWrapper>
      <AnimatePresence>
        {id ? (
          <Overlay
            variants={OverlayVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            onClick={() => setId(null)}
          >
            <Box layoutId={id} style={{ width: 500, height: 350 }}></Box>
          </Overlay>
        ) : null}
      </AnimatePresence>
    </Wrapper>
  );
}

export default App;
