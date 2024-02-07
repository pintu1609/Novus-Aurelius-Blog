import React,{useState, useEffect} from 'react'
import './updatePost.css'
import axios from 'axios';

const BASE_URL = process.env.BASE_URL || "https://stagingbe.novusaurelius.com/";


const UpdatePost = (props) => {
  const token = localStorage.getItem("token");
  const { id,  }=props;
  // console.log("🚀 ~ UpdatePost ~ onClick:", onClick)


  const [selectedImage, setSelectedImage] = useState({
    media_b64: "",
    file_name: "",
  });
 // eslint-disable-next-line
  const [filePreview, setFilePreview] = useState(null);

  const [blog, setBlog] = useState({
    title: "",
    image: selectedImage,
    content: [{
      subtitle: "",
      description: [""],
    }],
    is_featured: false,
  });
  const [subtitles, setSubtitles] = useState([{ subtitle: "" }]);
  
  const [blogDetails, setBlogDetails] = useState(null);
    

  useEffect(() => {
      getPostdetails();
      // eslint-disable-next-line
    }, [token,id ]);

  const getPostdetails = async () => {
    
    try {
      const response = await axios.post(`${BASE_URL}/post_login/blog/fetch_blog_post/`,{blog_id:id}, {
        headers: {
          Authorization: "x@pcPvmFcaUrMHQKY4@pNYG22rE&vAk&P-YmnjWx-/mGxr2wcqXXVUnW89S?d@6S",
          "Content-Type": "application/json",
          accesstoken: `${token}`,
        },
      });
      // console.log("🚀 ~ getPostdetails ~ response:", response)
      if (response.status === 200) {
        if (response.data.Status === 200) {
         
          setBlogDetails(response.data.Payload);

          

        } else {
          
          console.error("Unsuccessful login:", response.data.Message);
        }
          console.log("🚀 ~ getPostdetails ~ response.data.Payload:", response.data.Payload)
          // console.log("🚀 ~ getPost ~ response.data.Payload:", response.data.Payload)
      } else {
        
        console.error("Unexpected status code:", response.status);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    if (blogDetails && Array.isArray(blogDetails) && blogDetails.length > 0) {
      // console.log("🚀 ~ useEffect ~ blogDetails:", blogDetails);
  
      // Assuming you want to work with the details of the first blog post in the array
      const firstBlogPost = blogDetails[0];
       // eslint-disable-next-line
      const { title, blog_image_url, is_featured, blog_content } = firstBlogPost;
  
      if (blog_content && blog_content.length > 0) {
        const initialSubtitles = [];
        const initialDescriptions = [];
  
        blog_content.forEach((content) => {
          const { subtitle, description } = content.content;
          console.log("🚀 ~ blog_content.forEach ~ description:", description)
          console.log("🚀 ~ blog_content.forEach ~ subtitle:", subtitle)
  
          initialSubtitles.push(subtitle || "");
          initialDescriptions.push(description || [""]);
        });
          // console.log("🚀 ~ blog_content.forEach ~  initialSubtitles.push(subtitle || ""):",  initialSubtitles.push(subtitle || ""))
          console.log("🚀 ~ blog_content.forEach ~ initialDescriptions:", initialDescriptions)
          console.log("🚀 ~ blog_content.forEach ~ initialSubtitles:", initialSubtitles)
  
        setBlog({
          title: title || "",
          image: selectedImage,
          
          // console.log("🚀 ~ content:initialSubtitles.map ~ initialSubtitles:", initialSubtitles)
          content: initialSubtitles.map((subtitle, index) => ({

            subtitle: subtitle[index] || "",
          description: initialDescriptions[index] || "",
          })),
          is_featured: is_featured || false,
        });
        console.log("🚀 ~ content:initialSubtitles.map ~ subtitle:", initialSubtitles)
  
        setSubtitles(initialSubtitles);
      }
    }
     // eslint-disable-next-line
  }, [blogDetails]);
  console.log("🚀 ~ UpdatePost ~ blog:", blog)
  
  


  const updatePost = async () => {

    
    try {
      
      const response = await axios.post(`${BASE_URL}/post_login/blog/update_blog_post/${id}`, blog, {
        headers: {
          Authorization: "x@pcPvmFcaUrMHQKY4@pNYG22rE&vAk&P-YmnjWx-/mGxr2wcqXXVUnW89S?d@6S",
          "Content-Type": "application/json",
          accesstoken: `${token}`,
        },
      });
      console.log("🚀 ~ handleSubmit ~ response:", response)
      if (response.status === 200) {
        if (response.data.Status === 200) {
          
          
   

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



    const handleChange = async(e) => {
        const { name, value } = e.target;
    
        
          setBlog((prevFormData) => ({
            ...prevFormData,
            [name]: value,
          }));
        }

    const handleAddSubtitle = () => {
        setSubtitles((prevSubtitles) => [...prevSubtitles, { subtitle: "" }]);
        setBlog((prevFormData) => ({
          ...prevFormData,
          content: [
            ...prevFormData.content,
            { subtitle: "", description: [""] },
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
          updatedSubtitles[index] = { value};
          console.log("🚀 ~ setSubtitles ~ value:", value)
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
  return (
    <div>
        <div className="modal" tabIndex="-1" >
  <div className="modal-dialog">
    <div className="modal-content">
      <div className="modal-header">
        <h5 className="modal-title">Update Blog</h5>
       <i className="fa-solid fa-xmark fa-2xl" data-bs-dismiss="modal" onClick={props.onClose} style={{color:'white'}}></i>
      </div>
      <div className="modal-body">
        

      <form >
        {/* {successMessage && <div className="success-message">{successMessage}</div>} */}


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
                  style={{ height:'20px' ,'::placeholder': { height: '18px' } }}
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
       {subtitles.map((subtitle, index) => (
         <> 
         <label>SubTitles</label>
                 <div key={index} style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
                <input
                  type="text"
                  placeholder={`Enter subtitle ${index + 1}`}
                  name={`subtitle${index}`}
                  value={subtitle}
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
            
          <label>Descriptions</label>
          <div>
            {blog.content[index].description.map((desc, index2) => (
              <div key={index2} style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
                <textarea
                  type="text"
                  placeholder={`Enter description ${index2 + 1}`}
                  rows={2}
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

          {/* <button className='btt1' type='submit'>
            Post Blog
          </button> */}
        </form>


      </div>
      <div className="modal-footer">
        <button type="button" className=" btt1" data-bs-dismiss="modal" onClick={props.onClose}>Close</button>
        <button type="button" className="btt1" onClick={updatePost}>Save changes</button>
      </div>
    </div>
  </div>
</div>s
    </div>
  )
}

export default UpdatePost