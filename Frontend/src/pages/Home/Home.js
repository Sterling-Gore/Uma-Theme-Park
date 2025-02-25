import './Home.css'
import { useNavigate } from "react-router-dom";

const Home = () => {

  const navigate =  useNavigate();

  return (
    <div className="home-container">
      <div className="home-text">
        <h1>Park Name</h1>
        <span><i>some text</i></span>
        <button className='buy-tickets-button' onClick={()=>navigate('/tickets')}>
          Buy Tickets
        </button>
      </div>
    </div>
  );
}

export default Home