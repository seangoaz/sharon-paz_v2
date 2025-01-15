import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

// Import pages
import StudentHomePage from './pages/StudentHomePage';
import AdminHomePage from './pages/AdminHomePage';
import Home from './pages/Home';
import StudenLogin from "./pages/StudentLogin";
import AdminLogin from "./pages/AdminLogin";
import StudentRegister from "./pages/StudentRegister";
import FeedbackPage from "./pages/FeedbackPage";
import AddCourse from "./components/AddCourse"; 


// Import components
import Header from './components/Header';
import RegisterToCourse from './pages/RegisterToCourse';
import RegisterToCourseNext from './pages/RegisterToCourseNext';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/studenthomepage" element={<StudentHomePage />} />
          <Route path="/studentlogin" element={<StudenLogin />} />
          <Route path="/adminlogin" element={<AdminLogin />} />
          <Route path="/student-register" element={<StudentRegister />} />
          <Route path="/adminhomepage" element={<AdminHomePage />} />
          <Route path="/register" element={<RegisterToCourse />} />
          <Route path="/feedbackpage" element={<FeedbackPage />} />
          <Route path="/RegisterToCourseNext/:selectedClass" element={<RegisterToCourseNext />} />
      </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
