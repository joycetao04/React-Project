import Header from './Header.jsx'
import HomeCard from './HomeCards.jsx';
import TodayArtworkSection from './TodaysArtworkSeaction.jsx';
import HomeGridCard from './HomeGridCard.jsx';
import SearchButton from './SearchButton.jsx'; 
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SearchPage from './SearchPage.jsx';
import HomePage from './HomePage.jsx';
import DailyArtworkPage from './pages/dailyartworkpage/DailyArtworkPage.jsx';
import ArticlePage from './pages/articlepage/ArticlePage.jsx';
import ArtThreadsPage from './pages/artthreadspage/ArtThreadsPage.jsx';


///////images
import DailyArtwork from './assets/DailyArtwork.png'
import ArtMap from './assets/ArtMap.png'
import ArtThreads from './assets/ArtThreads.png'
import StarterPack from './assets/StarterPack.png'

import HomeGridCard1 from './assets/HomeGridCard1.png'
import HomeGridCard2 from './assets/HomeGridCard2.png'
import HomeGridCard3 from './assets/HomeGridCard3.png'
import HomeGridCard4 from './assets/HomeGridCard4.png'

function App() {
    return(
      
      <Router>
        <div className='HomeColor'>
          
          <Routes>
            <Route path="/" element={
              <>
                <HomePage></HomePage>
              </>
            } />
            <Route path="/" element={<HomePage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/DailyArtworkPage" element={<DailyArtworkPage />} />
            <Route path="/ArticlePage" element={<ArticlePage />} />
            <Route path="/ArtThreadsPage" element={<ArtThreadsPage />} />
            
          </Routes>
        </div>
      </Router>
    );
}

export default App


// test update