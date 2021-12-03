import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useRecoilValue } from "recoil";
import Footer from "./Components/Footer";
import Header from "./Components/Header";
import Home from "./Routes/Home";
import Tv from "./Routes/Tv";
import { isInBigBox } from "./atom";

function App() {
  const inBox = useRecoilValue(isInBigBox);
  return (
    <Router>
      <Header></Header>
      <Routes>
        <Route path="/*" element={<Home></Home>}></Route>
        <Route path="/tv" element={<Tv></Tv>}></Route>
        <Route path="/search"></Route>
      </Routes>
      {!inBox ? <Footer></Footer> : null}
    </Router>
  );
}

export default App;
