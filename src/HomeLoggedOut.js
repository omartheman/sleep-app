import { Container } from 'react-bootstrap';
import './HomeLoggedOut.scss';
import svgLandingPageSection1 from './landing-background-opt.svg';
import backgroundTop from './landing-background-opt.svg';
import sleepingGirlImg from './images/sleeping-girl.jpg';
import shootingStar from './images/shooting-star-opt.svg';
import graphScreenshot1 from './images/time-out-of-bed-screenshot-square.png';
import graphScreenshot2 from './images/time-to-fall-asleep-screenshot-square.png';

function HomeLoggedOut() {
  return(
    <>
          <div className="home-logged-out-section-1-shooting-star">
            <svg width="60mm" height="60mm" version="1.1" viewBox="0 0 60 60">
              <defs>
                <filter id="filter6059" x="-1.9142e-5" y="-1.9258e-5" width="1" height="1" color-interpolation-filters="sRGB">
                <feGaussianBlur stdDeviation="0.00049892852"/>
                </filter>
              </defs>
              <path transform="matrix(.9426 0 0 .94833 1.2795 2.1897)" d="m-0.75595 60.665 62.555-62.177" fill="none" filter="url(#filter6059)" stroke="#fff" stroke-linecap="round" stroke-width="1.3992"/>
              </svg>
          </div>
      <Container className="home-logged-out-container">
        <div className="home-logged-out-section-1">
          <h1>Welcome to Sleep App</h1>
          <div>Improve your sleep.</div>
          <div>Change your life.</div>
        </div>
        <div className="home-logged-out-section-2">
          <div  className="home-logged-out-section-2-background"></div>
          {/* <img className="home-logged-out-section-2-background" src={sleepingGirlImg}/> */}
          <h2>How It Works</h2>
          <div>Simply input your sleep data each day, and view generated graphs to track your sleep progress.</div>
          <div className="home-logged-out-section-2-graphs">
            <img src={graphScreenshot1} />
            <img src={graphScreenshot2} />
          </div>
        </div>
      </Container>
    </>
  )
}

export default HomeLoggedOut; 