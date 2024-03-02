import React,{useEffect, useState} from 'react'
import './blogpost.css'
import BlogItem from '../Components/BlogItem'
import  axios from 'axios'
import { useNavigate,useLocation } from 'react-router-dom';
// import { hover } from '@testing-library/user-event/dist/hover';
import Navbar from '../Components/navbar/Navbar';
const BASE_URL = process.env.BASE_URL || "https://stagingbe.novusaurelius.com/";


const Blogpost = (props) => {
    const token = localStorage.getItem("token");
    const profile_id = localStorage.getItem("profile_id");

    const [blogPosts, setBlogPosts] = useState([]);
    const [dependency, setDependency] = useState(false)
    const initialBlogCount=4;
    const [blogCount, setBlogCount] = useState(initialBlogCount);
    const [featureBlog, setFeatureBlog] = useState([])
    const [successMessage, setSuccessMessage] = useState(''); // Added this line

    const location = useLocation();
  const { state } = location; // Access the state object


    const navigate=useNavigate();

    useEffect(() => {
        getPost();
                // eslint-disable-next-line
 }, [token, dependency]);
      useEffect(() => {
        if (state && state.loginSuccess) {
          setSuccessMessage('Login successful!');
          setTimeout(() => {
            setSuccessMessage('');
            navigate('/blogpost', { replace: true });
          }, 2000);
        }
      }, [state, navigate]);


    const getPost = async () => {
    
        try {
          const response = await axios.patch(`${BASE_URL}/post_login/blog/fetch_blog_post/`,{
            view_profile_id: profile_id,
          }, {
            headers: {
              Authorization: "x@pcPvmFcaUrMHQKY4@pNYG22rE&vAk&P-YmnjWx-/mGxr2wcqXXVUnW89S?d@6S",
              "Content-Type": "application/json",
              accesstoken: `${token}`,
            },
          });
          if (response.status === 200) {
            if (response.data.Status === 200) {
              setBlogPosts(response.data.Payload);
              console.log("🚀 ~ getPost ~ response:", response)
            } 
            if (response.data.Status === 451) {
              console.log('🚀 ~ fetchData ~ data.Status:', response.Status === 451);
              localStorage.removeItem('token');

              // logout();
              navigate('/');
            }
    
            // else {
              
            //   console.error("Unsuccessful login:", response.data.Message);
            // }
          } else {
            
            console.error("Unexpected status code:", response.status);
          }
        } catch (error) {
          console.error("Error:", error);
        }
      };



        // fetch feature blog

        useEffect(() => {
          getfeaturePost();
                  // eslint-disable-next-line
        }, [token, dependency]);

        const getfeaturePost = async () => {
    
          try {
            const response = await axios.patch(`${BASE_URL}/post_login/blog/fetch_featured_blog_post/`,{
              view_profile_id: profile_id,
            }, {
              headers: {
                Authorization: "x@pcPvmFcaUrMHQKY4@pNYG22rE&vAk&P-YmnjWx-/mGxr2wcqXXVUnW89S?d@6S",
                "Content-Type": "application/json",
                accesstoken: `${token}`,
              },
            });
            if (response.status === 200) {
              if (response.data.Status === 200) {
                setFeatureBlog(response.data.Payload);
                console.log("🚀 ~ getPost ~ response:", response)
              } 
              if (response.data.Status === 451) {
                console.log('🚀 ~ fetchData ~ data.Status:', response.data.Status === 451);
                localStorage.removeItem('token');
  
                // logout();
                navigate('/');
              }
      
              // else {
                
              //   console.error("Unsuccessful login:", response.data.Message);
              // }
            } else {
              
              console.error("Unexpected status code:", response.status);
            }
          } catch (error) {
            console.error("Error:", error);
          }
        };





  const handleBlogClick=(item)=>{
  navigate('/blogdetails', {state:item})
    }
  // const handleNextClick = () => {
  //   setActiveIndex((prevIndex) => prevIndex + 2);
  // };

  // const handlePrevClick = () => {
  //   setActiveIndex((prevIndex) => Math.max(0, prevIndex - 2));
  // };
  
  const handleChange=()=>{
    setDependency((prev)=>!prev)

  }
  const handleLoadMore = () => {
    setBlogCount(blogCount + 9);
  };
  const handleAddblog=()=>{
    navigate('/blog')
  }
  
  return (
    <div>
      <div className='blogpost'>

     

      <div className='blog-sections'>
      {successMessage && <div className="success-message">{successMessage}</div>}
              <Navbar/>

        <div className='blog-sec'>
          <div className='blog-top'>
             <button className='bttadd' onClick={handleAddblog}>Add Blog</button>
            <div className="blogHeaderSection">
             <h3> Novus Blog</h3> 
            </div>
            {/* <i className="fa-solid fa-right-from-bracket" style={{color:'#a4a6b0', cursor:'pointer'}} onClick={handleLogout}
>Logout</i> */}
          </div>
      <h5 className="blog-title">See News & Articles</h5>
      <p className="blog-title-paragraph">
        Here are our Blogs and Articles at Novus Aurelius which provide
        Financial Insight's and News Related to the world of Stock Market
      </p>

     
      <div className='latestblog'>
      <div className='heading'>
      <h5>Featured:</h5>


      </div>


              <div className='container' style={{display:'flex', alignItems:'center'}}> 
             
            <div className='blogs' style={{display:'flex', justifyContent:'center', flexFlow:'wrap'}}>
            {featureBlog?.slice(0, blogCount)?.map((item) => (
            <BlogItem
                Id={item.blog_id}

              title={item.title}
              addedDate={item.added_date}
              imageUrl={item.blog_image_url}
              isFeatured={item.is_featured}
              author={item.author_name}
              onClick={() => handleBlogClick(item)}
              changedependency={()=>handleChange()}
              onDeleteSuccess={props.onDeleteSuccess}
              
            />
          ))}

      </div>
     
</div>
        {featureBlog?.length > blogCount && (
          <button className='btt' onClick={handleLoadMore}>Load More</button>
        )}
        </div>

        

      <div className='latestblog'>
      <div className='heading'>
      <h5>Latest:</h5>


      </div>

              <div className='container' style={{display:'flex', alignItems:'center'}}> 
             
            <div className='blogs' style={{display:'flex', justifyContent:'center', flexFlow:'wrap'}}>
            {blogPosts?.slice(0, blogCount)?.map((item) => (
            <BlogItem
                Id={item.blog_id}

              title={item.title}
              addedDate={item.added_date}
              imageUrl={item.blog_image_url}
              isFeatured={item.is_featured}
              author={item.author_name}
              onClick={() => handleBlogClick(item)}
              changedependency={()=>handleChange()}
              onDeleteSuccess={props.onDeleteSuccess}
              
            />
          ))}

      </div>
     
</div>
        {blogPosts?.length > blogCount && (
          <button className='btt' onClick={handleLoadMore}>Load More</button>
        )}
        </div>


        </div>
</div>
</div>
    </div>
  )
}

export default Blogpost
