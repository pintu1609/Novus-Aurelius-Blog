import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './Pages/Login';
import Blog from './Pages/Blog';
import BlogDetails from './Components/BlogDetails';
import Blogpost from './Pages/Blogpost';
function App() {
  return (
    <div >
      
      <BrowserRouter>
        <Routes>
        <Route exact path="/" element={<Login/>} />
        <Route exact path="/blog" element={<Blog/>} />
        <Route exact path='blogpost' element={<Blogpost/>}/>
        <Route exact path="/blogdetails" element={<BlogDetails/>} />

        </Routes>

      </BrowserRouter>


    </div>
  );
}

export default App;
