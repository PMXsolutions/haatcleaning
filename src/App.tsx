import './App.css'
import { Navbar } from '@/components/shared/navbar'
import { Footer } from '@/components/shared/footer'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/index';
// import About from './pages/about';

function App() {

  return (
    <BrowserRouter>
      <div className="bg-primary max-w-screen-xl mx-auto">
        <Navbar />
        <main className="">
          <Routes>
            <Route path="/" element={<Home />} />
            {/* <Route path="/about" element={<About />} /> */}
            {/* <Route path="/contact" element={<Contact />} /> */}
            {/* Add more routes as needed */}
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App
