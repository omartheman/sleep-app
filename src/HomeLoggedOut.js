import { Button, Container } from 'react-bootstrap';
import './HomeLoggedOut.scss';
import graphScreenshot1 from './images/time-out-of-bed-screenshot-square.png';
import graphScreenshot2 from './images/time-to-fall-asleep-screenshot-square.png';
import { Link } from 'react-router-dom';

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
        <div className="home-logged-out-section home-logged-out-section-1">
          <h1>Welcome to Sleep App</h1>
          <div>Improve your sleep.</div>
          <div>Create helpful graphs with simple inputs, for free.</div>
        </div>

        <div className="home-logged-out-section home-logged-out-section-2">
          <div  className="home-logged-out-section-background home-logged-out-section-2-background"></div>
          <div className="home-logged-out-section-text">
            <h2>How It Works</h2>
            <div>Simply input your sleep data each day, and view generated graphs to track your sleep progress.</div>
          </div>
          <div className="home-logged-out-section-2-graphs">
            <img src={graphScreenshot1} />
            <img className="home-logged-out-section-2-image-2" src={graphScreenshot2} />
          </div>
        </div>

        <div className="home-logged-out-section home-logged-out-section-3">
          <div  className="home-logged-out-section-background home-logged-out-section-3-background"></div>
          <div className="home-logged-out-section-text">
            <h2>Why Seeing Data Helps</h2>
            <div>Having a visual record of your sleep habits allows you to compare which factors are affecting your sleep wellness.</div>
          </div>
          <div className="home-logged-out-section-2-graphs">
            <img src={graphScreenshot2} />
          </div>
        </div>

        <div className="home-logged-out-section home-logged-out-section-1">
          <h2>Better sleep.</h2>
          <h2>Better life.</h2>
          <h2>Starting tonight.</h2>
          <div className="home-logged-out-section-3-button-container">
            <Button as={Link} to={'/sleep/create-account'}>Create Account</Button>
          </div>
        </div>
      </Container>
    </>
  )
}

export default HomeLoggedOut; 