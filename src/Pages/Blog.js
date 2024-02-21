import React, { useState, useEffect } from 'react';
import './blog.css';
import axios from 'axios';
import { BeatLoader } from 'react-spinners';


// import Blogpost from './Blogpost';
import {  useNavigate } from 'react-router-dom';
import Navbar from '../Components/navbar/Navbar';

const BASE_URL = process.env.BASE_URL || "https://stagingbe.novusaurelius.com/";

const Blog = () => {

  const [successMessage, setSuccessMessage] = useState('');

  // const handleDeleteSuccess = () => {
  //   setSuccessMessage('Blog post deleted successfully!');
  //   setTimeout(() => {
  //     setSuccessMessage('');
  //   }, 2000);
  //   setBlog((prev) => ({ ...prev }));

  // };
  const navigate= useNavigate();
  // const handleLogout = () => {
  //   localStorage.removeItem('token');
  //   navigate('/');
    
  // }
  const token = localStorage.getItem("token");
  const [selectedImage, setSelectedImage] = useState({
    media_b64: "",
    file_name: "",
  });
  // const [selectedSubtitleImage, setSelectedSubtitleImage] = useState({
  //   media_b64: "",
  //   file_name: "",
  // });
        // eslint-disable-next-line
  const [filePreview, setFilePreview] = useState(null);
  // const { state } = useLocation();


  // console.log("🚀 ~ Blog ~ selectedSubtitleImage:", selectedSubtitleImage)
  const [blog, setBlog] = useState({
    title: "",
    image: selectedImage,
    content: [{
      subtitle: "",
      subtitle_image:{
        media_b64:"",
        file_name:"",
      },
      description: [""],
    }],
    is_featured: false,
  });
  console.log("🚀 ~ Blog ~ blog:", blog)


  const [subtitles, setSubtitles] = useState([{ subtitle: "" }]);
  const [loading, setLoading] = useState(false); // State to control loading indicator

  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true when form is submitted

    
    try {
      
      const response = await axios.post(`${BASE_URL}post_login/blog/create_blog_post/`, blog, {
        headers: {
          Authorization: "x@pcPvmFcaUrMHQKY4@pNYG22rE&vAk&P-YmnjWx-/mGxr2wcqXXVUnW89S?d@6S",
          "Content-Type": "application/json",
          accesstoken: `${token}`,
        },
      });
      console.log("🚀 ~ handleSubmit ~ response:", response)
      if (response.status === 200) {
        if (response.data.Status === 200) {
          localStorage.setItem("token", response.data.new_access_token);
          setSuccessMessage('Blog post created successfully!');
          setTimeout(() => {
            setSuccessMessage('');
          }, 2000);
          setBlog({
            title: "",
            image: {
              media_b64:"",
              file_name:"",
            },
            content: [{
            subtitle: "",
            subtitle_image: {
              media_b64:"",
              file_name:"",
            },
            description: [""],
    }],
    is_featured: false,
          });
          setSubtitles([{ subtitle: "" ,subtitle_image: {
            media_b64:"",
            file_name:"",
          },}]);
          setSelectedImage({
            media_b64: "",
            file_name: "",
          });

        }
        if (response.data.Status === 451) {
          console.log('🚀 ~ fetchData ~ data.Status:', response.status === 451);
          localStorage.removeItem('token');

          // logout();
          navigate('/');
        }
        else {
          console.error("Unsuccessful login:", response.data.Message);
          setLoading(false); // Set loading to false after form submission is complete

        }
      } else {
        console.error("Unexpected status code:", response.status);
        setLoading(false); // Set loading to false after form submission is complete

      }
    } catch (error) {
      console.error("Error:", error);
      setLoading(false); // Set loading to false after form submission is complete

    }
  };

  const handleChange = async(e) => {
    const { name, value } = e.target;

    
      setBlog((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    }
  // };
  
  useEffect(() => {
    setBlog((prev)=>({...prev, image:selectedImage}))
    // setBlog((prev)=>({...prev, subtitle_image:selectedSubtitleImage}))

  
  }, [selectedImage, ])
  // useEffect(() => {
  //   if (state && state.loginSuccess) {
  //     setSuccessMessage('Login successful!');
  //     setTimeout(() => {
  //       setSuccessMessage('');
  //       navigate('/blog', { replace: true });
  //     }, 2000);
  //   }
  // }, [state, navigate]);
  

  const handleAddSubtitle = () => {
    setSubtitles((prevSubtitles) => [...prevSubtitles, { subtitle: "",subtitle_image: {
      media_b64:"",
      file_name:"",
    }, }]);
    setBlog((prevFormData) => ({
      ...prevFormData,
      content: [
        ...prevFormData.content,
        { subtitle: "",subtitle_image:{
          media_b64:"",
          file_name:"",
        }, description: [""] },
      ],
    }));
  };

  const handleRemoveSubtitle = (index) => {
    if (subtitles.length > 1) {
      setSubtitles((prevSubtitles) => {
        const updatedSubtitles = [...prevSubtitles];
        updatedSubtitles.splice(index, 1);
        return updatedSubtitles;
      });
      setBlog((prevFormData) => {
        const updatedContent = [...prevFormData.content];
        updatedContent.splice(index, 1);
        return { ...prevFormData, content: updatedContent };
      });
    }
  };


  const handleSubtitleChange = (index, e) => {
    const { value } = e.target;
    setSubtitles((prevSubtitles) => {
      const updatedSubtitles = [...prevSubtitles];
      updatedSubtitles[index] = { subtitle: value };
      return updatedSubtitles;
    });
    setBlog((prevFormData) => {
      const updatedContent = [...prevFormData.content];
      updatedContent[index].subtitle = value;
      return { ...prevFormData, content: updatedContent };
    });
  };

  

  const handleAddDescription = (index, index2) => {
    if(blog.content[index].description[blog.content[index].description.length-1]){
      setBlog((prevFormData) => {
        const updatedContent = [...prevFormData.content];
        updatedContent[index].description[index2+1]=""
        
        return { ...prevFormData, content: updatedContent };
      });
    }
  };



const handleRemoveDescription = (index, index2) => {
  if (blog.content[index].description.length > 1) {
    setBlog((prevFormData) => {
      const updatedContent = [...prevFormData.content];
      updatedContent[index].description.splice(index2, 1);
      return { ...prevFormData, content: updatedContent };
    });
  }
};


  const handleDescriptionChange = (index,index2, e) => {
    const { value } = e.target;
    
    setBlog((prevFormData) => {
      const updatedContent = [...prevFormData.content];
      updatedContent[index].description[index2] = value;
      return { ...prevFormData, content: updatedContent };
    });
  };

  const handleSubtitleImageChange = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64Image = e.target.result;
        setBlog((prevFormData) => {
          const updatedContent = [...prevFormData.content];
          updatedContent[index].subtitle_image = { media_b64: base64Image.split(",")[1], file_name: file.name };
          return { ...prevFormData, content: updatedContent };
        });
        setFilePreview(file);
      };
      reader.readAsDataURL(file);
    } else {
      // If no image is selected, include an empty subtitle_image
      setBlog((prevFormData) => {
        const updatedContent = [...prevFormData.content];
        updatedContent[index].subtitle_image = { media_b64: "", file_name: "" };
        return { ...prevFormData, content: updatedContent };
      });
    }
  };
  

  const handleBack =()=>{
    navigate('/blogpost')
  }

 

  return (
    
    
    <div >
      <div className='blog' >
        <div className='blogcontainer'>

        

      
      <div className='blogwrapper'>

      
      <Navbar/>

    <div className='blogcontent'>
      <div className='blogwrappertop'>
        <div style={{display:'flex', justifyContent:'space-between',alignItems:'center', width:'75%', marginRight:'50%'}}>
          <p className='backbtt'  onClick={handleBack}>Back</p>
        <span className='blogtitle'>Post a new blog</span>
          {/* <i className="fa-solid fa-right-from-bracket" style={{color:'#a4a6b0', marginLeft:'36vw', cursor:'pointer'}} onClick={handleLogout}
>Logout</i> */}
        </div>
        <form onSubmit={handleSubmit}>
        {successMessage && <div className="success-message">{successMessage}</div>}


          <label>Title</label>
          <input
            type="text"
            placeholder="Enter title"
            name="title"
            value={blog.title}
            onChange={handleChange}
          />

          <label>Choose Image</label>
         
             <input
                  type="file"
                  id="imageInput"
                  // style={{ height:'30px' ,'::placeholder': { height: '23px' } }}
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (e) => {
                        const base64Image = e.target.result;
                        setSelectedImage({
                          media_b64: base64Image.split(",")[1],
                          file_name: file.name,
                        });
                        setFilePreview(file);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />

          <div>
       {subtitles.map((sub, index) => (
         <> 
         <label>SubTitles</label>
                 <div key={index} style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
                <input
                  type="text"
                  placeholder={`Enter subtitle ${index + 1}`}
                  name={`subtitle${index}`}
                  value={sub.subtitle}
                  onChange={(e) => handleSubtitleChange(index, e)}
                />
                <i
                  className="fa-solid fa-plus"
                  style={{ color: 'white', marginLeft: '10px' }}
                  onClick={handleAddSubtitle}
                ></i>
                {index > 0 && (
                  <>
                    <i
                      className="fa-solid fa-minus"
                      style={{ color: 'white', marginLeft: '10px' }}
                      onClick={() => handleRemoveSubtitle(index)}
                    ></i>
                  </>
                )}
              </div>

              <div>

              <label>Choose Subtitle Image</label>
         
              <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleSubtitleImageChange(index, e)}
                    />
                    {/* {blog.content[index].subtitle_image && blog.content[index].subtitle_image.map((image, i) => (
                      <img key={i} src={`data:image/jpeg;base64,${image.media_b64}`} alt={`Subtitle ${index + 1}`} style={{width:'70%',height:'70px', padding:'10px', borderRadius:'15px', objectFit:'cover'}} />
                    ))} */}
                    {/* {index > 0 && (
                      <i
                        className="fa-solid fa-minus"
                        style={{ color: 'white', marginLeft: '10px', cursor: 'pointer' }}
                        onClick={() => handleRemoveSubtitle(index)}
                      ></i>
                    )} */}
            
            </div>
          <label>Descriptions</label>
          <div>
            {blog.content[index].description.map((desc, index2) => (
              <div key={index2} style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
                <textarea
                  type="text"
                  placeholder={`Enter description ${index2 + 1}`}
                  rows={4}
                  name={`description${index2}`}
                  value={desc}
                  onChange={(e) => handleDescriptionChange(index,index2, e)}
                />
                <i
                  className="fa-solid fa-plus"
                  style={{ color: 'white', marginLeft: '10px' }}
                  onClick={()=>handleAddDescription(index, index2)}
                ></i>
                {index2 > 0 && (
                  <>
                    <i
                      className="fa-solid fa-minus"
                      style={{ color: 'white', marginLeft: '10px' }}
                      onClick={() => handleRemoveDescription(index, index2)}
                    ></i>
                  </>
                )}
              </div>
            ))}
          </div>
          </>
          ))}
          </div>

          <div className='checkbox-wrapper'>
            <label htmlFor='isFeatured' className='checkbox-label'>
              Is Featured:
            </label>
            <input
              type='checkbox'
              id='isFeatured'
              name='is_featured'
              className='checkbox-input'
              checked={blog.is_featured}
              onChange={() => setBlog((prevFormData) => ({ ...prevFormData, is_featured: !prevFormData.is_featured }))}
            />
          </div>

          <button className='btt1' type='submit'>
           {loading?(<BeatLoader size={12} color="white" />):('Post Blog')}
          </button>
        </form>
      </div>

      {/* <div className='allblog'>
        <span className='blogtitle'> Your Blog</span>
        <Blogpost onDeleteSuccess={handleDeleteSuccess} />
      </div> */}
    </div>
    </div>
    </div>
    </div>
    </div>

  );
};

export default Blog;
