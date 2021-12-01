import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./Components/Header";
import Home from "./Routes/Home";
import Tv from "./Routes/Tv";

function App() {
  return (
    <Router>
      <Header></Header>
      <Routes>
        <Route path="/*" element={<Home></Home>}></Route>
        <Route path="/tv" element={<Tv></Tv>}></Route>
        <Route path="/search"></Route>
      </Routes>
    </Router>
  );
}

export default App;
