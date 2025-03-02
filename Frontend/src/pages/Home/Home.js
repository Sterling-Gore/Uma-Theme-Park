import './Home.css'
import { useEffect, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import UserContext from '../../context/userContext';

const Home = () => {

  const navigate =  useNavigate();

  const { userType } = useContext(UserContext);

    useEffect(() => {
        if (userType === "employee") {
            navigate('/EmployeePortal');
        }
    }, [userType, navigate]);

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