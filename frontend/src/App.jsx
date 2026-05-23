// Application router that connects URLs to page-level screens.
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom"
<<<<<<< HEAD
=======
import { AnimatePresence, motion } from "framer-motion"
>>>>>>> d417c960dd5719642e7328a49bba71d30ef531ff
import './styles/index.css'
import Home from "./pages/Home"
import SubjectSelection from "./pages/SubjectSelection"
import Interview from "./pages/Interview"
import History from "./pages/History"
import Resume from "./pages/Resume"
import Progress from "./pages/Progress"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import Admin from "./pages/Admin"
import Feedback from "./pages/Feedback"
import AboutUs from "./pages/aboutus"
import Navbar from "./components/Navbar"
import ProtectedRoute from "./components/ProtectedRoute"

<<<<<<< HEAD
function AppRoutes() {
  const { pathname } = useLocation()
=======
const PageWrapper = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
  >
    {children}
  </motion.div>
)

function AppRoutes() {
  const location = useLocation()
  const { pathname } = location
>>>>>>> d417c960dd5719642e7328a49bba71d30ef531ff
  const isHome = pathname === "/"

  return (
    <main className="min-h-screen transition-colors duration-300 bg-gradient-mesh">
      <div className={isHome ? "w-full pt-8" : "container mx-auto px-4 py-8"}>
<<<<<<< HEAD
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          <Route element={<ProtectedRoute userOnly />}>
            <Route path="/subject-selection" element={<SubjectSelection />} />
            <Route path="/interview" element={<Interview />} />
            <Route path="/history" element={<History />} />
            <Route path="/resume" element={<Resume />} />
            <Route path="/progress" element={<Progress />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route path="/feedback/:id" element={<Feedback />} />
          </Route>

          <Route element={<ProtectedRoute adminOnly />}>
            <Route path="/admin" element={<Admin />} />
          </Route>
        </Routes>
=======
        <AnimatePresence mode="wait">
          <Routes location={location} key={pathname}>
            <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
            <Route path="/about-us" element={<PageWrapper><AboutUs /></PageWrapper>} />
            <Route path="/login" element={<PageWrapper><Login /></PageWrapper>} />
            <Route path="/signup" element={<PageWrapper><Signup /></PageWrapper>} />
            
            <Route element={<ProtectedRoute userOnly />}>
              <Route path="/subject-selection" element={<PageWrapper><SubjectSelection /></PageWrapper>} />
              <Route path="/interview" element={<PageWrapper><Interview /></PageWrapper>} />
              <Route path="/history" element={<PageWrapper><History /></PageWrapper>} />
              <Route path="/resume" element={<PageWrapper><Resume /></PageWrapper>} />
              <Route path="/progress" element={<PageWrapper><Progress /></PageWrapper>} />
            </Route>

            <Route element={<ProtectedRoute />}>
              <Route path="/feedback/:id" element={<PageWrapper><Feedback /></PageWrapper>} />
            </Route>

            <Route element={<ProtectedRoute adminOnly />}>
              <Route path="/admin" element={<PageWrapper><Admin /></PageWrapper>} />
            </Route>
          </Routes>
        </AnimatePresence>
>>>>>>> d417c960dd5719642e7328a49bba71d30ef531ff
      </div>
    </main>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <AppRoutes />
    </BrowserRouter>
  )
}

export default App
