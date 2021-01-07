import { Container } from 'react-bootstrap';
import './HomeLoggedOut.scss';
import svgLandingPageSection1 from './landing-background-opt.svg';
import backgroundTop from './landing-background-opt.svg';

function HomeLoggedOut() {
  return(
    <>
      <Container className="home-logged-out-container">
        <div className="home-logged-out-section-1">
          <h1>Welcome to Sleep App</h1>
          <div>Improve your sleep.</div>
          <div>Change your life.</div>
        </div>
        <div className="home-logged-out-section-2">
          <h2>How It Works</h2>
        </div>
      </Container>
    </>
  )
}

export default HomeLoggedOut; 