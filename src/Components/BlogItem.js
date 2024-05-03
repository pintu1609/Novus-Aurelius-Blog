import React, { useState } from 'react';
import './BlogItem.css';
import axios from 'axios';
import UpdatePost from '../Pages/UpdatePost';
import { CircleLoader } from 'react-spinners';
import Modal from 'react-modal'; // Import the Modal component from react-modal

const BASE_URL = process.env.BASE_URL || "https://stagingbe.novusaurelius.com/";

const BlogItem = (props) => {
  const { Id, title, addedDate, imageUrl, onClick, onDeleteSuccess, changedependency } = props;

  const dateObject = new Date(addedDate);
  const formattedDate = dateObject.toLocaleDateString();
  const token = localStorage.getItem("token");

  const [successMessage, setSuccessMessage] = useState('');
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // State for loading status
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false); // State for confirmation modal

  const closeUpdateModal = () => {
    setIsUpdateModalOpen(false);
  };

  const deletePost = async (Id) => {
    setIsConfirmationModalOpen(false); // Close the confirmation modal
    setIsLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/post_login/blog/delete_blog_post/${Id}`, {
        headers: {
          Authorization: "x@pcPvmFcaUrMHQKY4@pNYG22rE&vAk&P-YmnjWx-/mGxr2wcqXXVUnW89S?d@6S",
          "Content-Type": "application/json",
          accesstoken: `${token}`,
        },
      });
      setIsLoading(false);
      if (response.status === 200) {
        if (response.data.Status === 200) {
          setSuccessMessage('Blog Post Deleted Successfully!');
          setTimeout(() => {
            setSuccessMessage('');
          }, 2000);
          changedependency();
          onDeleteSuccess();

        } else {
          console.error("Unsuccessful login:", response.data.Message);
        }

      } else {
        console.error("Unexpected status code:", response.status);
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Error:", error);
    }
  };

  const slicedTitle = title.length > 30 ? `${title.slice(0, 30)}...` : title;

  return (
    <div>
      <div className='blogcontets'>

        <div className='blogtit'>
          <div className='blogdele ' style={{ display: 'flex', alignItems: 'center', justifyContent: 'end' }}>

            <div style={{ display: 'flex', }}>
              {isLoading ? (
                <CircleLoader size={20} color={"#ffffff"} />
              ) : (
                <i className="fa-solid fa-trash-can" style={{ color: 'white', cursor: 'pointer' }} onClick={() => { setIsConfirmationModalOpen(true) }}></i>
              )}
            </div>

          </div>
          <img src={imageUrl} alt='' onClick={() => onClick()} />
        </div>
        <div className='des'>
          <span className='title'> {slicedTitle}</span>
          <span className='subtitles' style={{ fontSize: '20px', color: '#8f9bb7' }}>{formattedDate}</span>
        </div>

      </div>
      {successMessage && <div className="success-message">{successMessage}</div>}

      <Modal
        isOpen={isConfirmationModalOpen}
        onRequestClose={() => setIsConfirmationModalOpen(false)}
        style={{
          overlay: {
            backgroundColor: "transparent", // Set background color to transparent
            zIndex: 1000, // Set a higher z-index to make sure it appears above other elements
          },
          content: {
            backgroundColor: '#0a1035', // Custom background color
            padding:'10px',
            fontSize: '20px', // Custom font size
            height: '85px',
            width: 'max-content',
            border:'unset',
            top: '50px', // Center vertically
            left: '50%', // Center horizontally
            transform: 'translate(-50%, -20%)', // Move to center     
              
             }
        }}
      >
        <div className="modalcontent">

        <div className='title'>Are you sure you want to delete this post?</div>
        <div className="modalbtt">
        <button className='btt' onClick={() => deletePost(Id)}>Yes</button>
        <button className='btt' onClick={() => setIsConfirmationModalOpen(false)}>No</button>

        </div>
        </div>
      </Modal>

      {isUpdateModalOpen && (
        <UpdatePost
          onClose={closeUpdateModal}
          id={Id}
          // title={title}
          // image={imageUrl}
          // isFeatured={isFeatured}
          /* Pass any necessary props to UpdatePost component */
        />
      )}

    </div>
  )
}

export default BlogItem;
