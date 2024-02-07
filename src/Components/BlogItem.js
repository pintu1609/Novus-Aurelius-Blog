import React,{useState} from 'react'
import './BlogItem.css'
import axios from 'axios';
import UpdatePost from '../Pages/UpdatePost';
const BASE_URL = process.env.BASE_URL || "https://stagingbe.novusaurelius.com/";


const BlogItem = (props ) => {
  const {Id, title,addedDate,imageUrl,onClick, onDeleteSuccess, changedependency} =props;
  
  const dateObject = new Date(addedDate);
  const formattedDate = dateObject.toLocaleDateString();
  const token = localStorage.getItem("token");
 

  const [successMessage, setSuccessMessage] = useState('');
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  // const updatePost = () => {
  //   setIsUpdateModalOpen(true);
  // };

  const closeUpdateModal = () => {
    setIsUpdateModalOpen(false);
  };


  const deletePost = async (Id) => {
    
    try {
      const response = await axios.get(`${BASE_URL}/post_login/blog/delete_blog_post/${Id}`, {
        headers: {
          Authorization: "x@pcPvmFcaUrMHQKY4@pNYG22rE&vAk&P-YmnjWx-/mGxr2wcqXXVUnW89S?d@6S",
          "Content-Type": "application/json",
          accesstoken: `${token}`,
        },
      });
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
      console.error("Error:", error);
    }
  };
  const slicedTitle = title.length >30 ? `${title.slice(0, 30)}...` :title
   

  return (
    <div>
            <div className='blogcontets'  >

                <div className='blogtit'>
                  <div className='blogdele ' style={{display: 'flex',alignItems:'center', justifyContent:'end'}}>

                    <div style={{display:'flex',  }}>

                    {/* <i className="fa-solid fa-pen-to-square" style={{color:'white', cursor:'pointer',padding:'0px 10px' }} onClick={()=>{updatePost()}}></i> */}
                    
                    <i className="fa-solid fa-trash-can" style={{color:'white', cursor:'pointer' }} onClick={()=>{deletePost(Id)}
                    }></i>
                    </div>
                    
                  </div>
                    <img src={imageUrl} alt=''onClick={()=>onClick()}/>
                </div> 
                <div className='des'>
                    <span className='title'> {slicedTitle}</span>

                    
                   <span className='subtitles' style={{fontSize:'20px', color:'#8f9bb7'}}>{formattedDate}</span>


                </div>

            </div>
            {successMessage && <div className="success-message">{successMessage}</div>}
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

export default BlogItem