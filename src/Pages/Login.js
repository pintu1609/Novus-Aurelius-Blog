import React, { useEffect, useState } from 'react';
import './login.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { BeatLoader } from 'react-spinners';
import AOS from "aos"; // Import AOS library
import { eyeClose, eyeOpen } from '../utls';


const BASE_URL = process.env.BASE_URL || "https://stagingbe.novusaurelius.com/";
const Login = () => {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [Active, setActive] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false); // State to control loading indicator

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true when form is submitted

    try {
      const response = await axios.post(`${BASE_URL}session_handlers/user_login/`, formData, {
        headers: {
          Authorization: "x@pcPvmFcaUrMHQKY4@pNYG22rE&vAk&P-YmnjWx-/mGxr2wcqXXVUnW89S?d@6S",
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        if (response.data.Status === 200) {
          localStorage.setItem("token", response.data.Payload.access_token);
          localStorage.setItem("profile_id", response.data.Payload.user_profile_id);
          setSuccessMessage('Login successful!');
          setTimeout(() => {
            setSuccessMessage('');
            navigate("/blogpost", { state: { loginSuccess: true } });
          }, 2000);
        } else {
          console.error("Unsuccessful login:", response.data.Message);
          setError(response.data.Message || 'Unknown error occurred');
          setTimeout(() => {
            setError('');
          }, 2000);
        }
      } else {
        console.error("Unexpected status code:", response.status);
        setError(`Unexpected status code: ${response.status}`);
        setTimeout(() => {
          setError('');
        }, 2000);
      }
    } catch (error) {
      console.error("Error:", error);
      setError('An unexpected error occurred');
      setTimeout(() => {
        setError('');
      }, 2000);
    }

    setLoading(false); // Set loading to false after form submission is complete
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (token) return navigate("/blogpost");
    // eslint-disable-next-line 
  }, [token]);

  useEffect(() => {
    AOS.init();
  }, []);

  return (
    <div className='formcontainer'>
      <div className='content'>
        <div className="formwrapper">
          <div className="logintextwrapper" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div className='loginheader' style={{ display: 'flex' }}>
              <h1 className="loginheading">Welcome Back</h1>
              <span className="loginHandWave">👋</span>
            </div>
            <p className="loginDescription">
              We happy to see you again. To use your account, you should log
              in first.
            </p>
          </div>
          {error && <div className="error">{error}</div>}
          {successMessage && <div className="success">{successMessage}</div>}
          <hr className="orhr-line2" />
          <form onSubmit={handleSubmit}>
            <label className='title'> UserName*</label>
            <input
              type="text"
              placeholder="Enter Email or UserName"
              name="username"
              value={formData.username}
              onChange={handleChange}
            />
            <label className='title'> Password*</label>
            <div className="input-container">
              <input
                type={Active ? 'text' : 'password'}
                placeholder="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
              />
              <span>
                <span onClick={() => setActive(!Active)}>
                  {Active ? eyeOpen : eyeClose}
                </span>
              </span>
            </div>
            
              <button type="submit" className="btt">{loading?(<BeatLoader size={12} color="white" />):('Login')}</button>
           
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
