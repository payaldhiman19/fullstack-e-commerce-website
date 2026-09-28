import Navbar from "./components/Navbar";
import Flashsale from "./components/FlashSale";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import './App.css'

function App() {

  return (
    <>
     <Flashsale />
     <main>
      <Navbar />
      <Hero />
      </main>
      <Footer />
    </>
  )
}

export default App
