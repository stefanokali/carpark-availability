import logo from "./logo.svg";
import "./App.css";
import Map from "./pages/Map";
import { useEffect } from "react"


function App() {

  useEffect(() => {
    document.title = "Park go where"
  }, [])


  return (
    <div className="App">
      <Map />
    </div>
  );
}

export default App;
