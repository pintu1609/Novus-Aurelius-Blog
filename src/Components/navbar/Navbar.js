import React, {useState, useEffect, useCallback} from 'react';
import './navbar.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const BASE_URL = process.env.BASE_URL || "https://stagingbe.novusaurelius.com/";

const Navbar = () => {
    const token = localStorage.getItem("token");
    const profile_id = localStorage.getItem("profile_id");
    const [isOpen, setIsOpen] = useState(false);
    const navigate=useNavigate();
    const [profile, setProfile] = useState([]);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    const getProfile = useCallback(async () => {
        try {
            const response = await axios.post(`${BASE_URL}/post_login/user_profile/fetch_user_profile/`, {
                to_view_profile_id: profile_id,
            }, {
                headers: {
                    Authorization: "x@pcPvmFcaUrMHQKY4@pNYG22rE&vAk&P-YmnjWx-/mGxr2wcqXXVUnW89S?d@6S",
                    "Content-Type": "application/json",
                    accesstoken: `${token}`,
                },
            });
            if (response.status === 200) {
                if (response.data.Status === 200) {
                    setProfile(response.data.Payload);
                    console.log("🚀 ~ getPost ~ response:", response);
                } 
                if (response.data.Status === 451) {
                    console.log('🚀 ~ fetchData ~ data.Status:', response.data.Status === 451);
                    localStorage.removeItem('token');
                    navigate('/');
                } 
                
            } else {
                console.error("Unexpected status code:", response.status);
            }
        } catch (error) {
            console.error("Error:", error);
        }
    }, [token, profile_id, navigate]);

    useEffect(() => {
        getProfile();
        
    }, [token, getProfile]);
   

    

    return (
        <div>
            <div className='navwrapper'></div>
            <div className="navbar">
                <div className="navleft">
                    <img src="/assets/app-logo-main.svg" alt="" />
                </div>
                <div className="navright" style={{display:'flex'}}>
                    <img src={profile?.profile_avatar_url ? profile?.profile_avatar_url :profile?.profile_pic_url} alt="" className='profile' />
                    <img src="/assets/dropDown.png" alt="" style={{cursor:'pointer'}} className='dropdown' onClick={toggleSidebar} />
                </div>
                {isOpen && (
                    <div className="sidebar-nav" style={{display:'flex'}}>
                        <img src="/assets/logout.svg" alt="" />
                        <p className="log" onClick={handleLogout}> Logout </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Navbar;
