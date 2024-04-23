import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../firebase/Auth";
import { getStorage, ref, uploadBytes } from "firebase/storage";
import { Link, useNavigate} from "react-router-dom";
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { getDownloadURL } from "firebase/storage";
import { doSignOut } from "../firebase/FirebaseFunctions";
import Box from '@mui/material/Box';
//import Form from 'react-bootstrap/Form';
//import 'bootstrap/dist/css/bootstrap.min.css';
import { useRef } from "react";
import Typography from '@mui/material/Typography';


const Home = () => {
  const currentUser = useContext(AuthContext);
  const [file, setFile] = useState(null);
  const storage = getStorage();
  const [userName, setUserName] = useState('');
  const [category, setCategory] = useState('');
  const navigate = useNavigate(); // useNavigate hook
  const [lastUploadedFile, setLastUploadedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null); // for previewing image
  const [processedFile, setProcessedFile] = useState(null); // for uploading to Cloud Storage
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [removeBgProcessing, setRemoveBgProcessing] = useState(''); // for showing processing status
  const [mainCategory, setMainCategory] = useState('');

  const CLOTHING_CATEGORIES = {
    'Tops': ['T-shirts', 'Longsleeves', 'Tank tops', 'Hoodies', 'Blouses', 'Blazers & Vests', 'Sweaters', 'Jackets', 'Coats', 'Dresses', 'Overcoats'],
    'Bottoms': ['Jeans', 'Pants', 'Agency pant', 'Shorts', 'Skirts','Leggings','Socks'],
    'Shoes': ['Shoes', 'Sports shoes','Boots', 'Leather shoes', 'Sandals', 'Sneakers', 'Slippers','Heels'],
    'Accessories': ['Hats', 'Bags', 'Earings','Bracelets','Rings','Necklaces','Belts','Watches','Scarves','Accessories'],
  };


  const bottomRef = useRef(null);
  

  const handleMainCategoryChange = (e) => {
    setMainCategory(e.target.value);
    setCategory(''); // Reset specific category on main category change
  };

  const handleSpecificCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  useEffect(() => {
    const auth = getAuth();
    if (currentUser) {
      setUserName(currentUser.displayName);
    }
  }
  , [currentUser]);

  const handleSignOut = () => {
    doSignOut();
    navigate('/startPage');
    alert("You have been signed out");
  };


  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && ["image/jpeg", "image/png", "image/jpg", "image/bmp", "image/webp"].includes(selectedFile.type)) {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null); // reset preview url
      }  
      setFile(selectedFile);
      setProcessedFile(null); // reset processed file
      setUploadSuccess(false); // reset upload success
      setRemoveBgProcessing(''); // reset processing status
    } else {
      alert("Unsupported file type. Please select an image.");
      setFile(null);
    }
  };
  
  // remove background from image
  const handleConfirm = async () => {
    if (!currentUser) {
      alert("Please log in to upload files.");
      return;
    }
    if (file) {
      setRemoveBgProcessing('Removing image background...'); // set processing status
      const formData = new FormData();
      formData.append('size', 'auto');
      formData.append('image_file', file, file.name);
  
      try {
         //DEPLOYMENT
        //const response = await fetch("http://20.81.191.105:5000/remove-bg", {
        //LOCAL
        const response = await fetch("http://127.0.0.1:5000/remove-bg", {
          method: "POST",
          body: formData,
        });
  
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
  
        const blobData = await response.blob();
        setProcessedFile(new File([blobData], file.name, { type: 'image/png' }));
        setPreviewUrl(URL.createObjectURL(blobData));
        setRemoveBgProcessing('Background removal completed'); // reset processing status
        {/*bottomRef.current.scrollIntoView({ behavior: 'smooth' });*/}
      } catch (error) {
        console.error("Error removing background:", error);
        setRemoveBgProcessing('Failed to remove background');
        alert("Error removing background.");
        {/*bottomRef.current.scrollIntoView({ behavior: 'smooth' });*/}
      }
    }
  };
  


  const checkDocumentExists = async (userId) => {
    const db = getFirestore();
    const docRef = doc(db, "closets", userId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists();
  };

  // upload file after user has confirmed the processed image
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      alert("Please log in to upload files.");
      return;
    }
  
    if (!category) {
      alert("Please select a category for your clothing item.");
      return;
    }
  
    if (!processedFile) {
      alert("No processed file to upload.");
      return;
    }

    const exists = await checkDocumentExists(currentUser.uid);
    const storageRef = ref(storage, `clothes/${currentUser.uid}/${category}/${processedFile.name}`);

    try{
      const uploadTaskSnapshot = await uploadBytes(storageRef, processedFile);
      const url = await getDownloadURL(uploadTaskSnapshot.ref);
      
      // update or create document in Firestore
      const db = getFirestore();
      const closetRef = doc(db, "closets", currentUser.uid);
      const newClothingItem = {
        url,
        category,
        name: processedFile.name,
        timestamp: new Date()
      };
      
      // if document exists, update it; otherwise, create it
      await setDoc(closetRef, { items: exists ? arrayUnion(newClothingItem) : [newClothingItem] }, { merge: true });

      // set last uploaded file for display
      setLastUploadedFile({ category, name: processedFile.name });
      setUploadSuccess(true); // set upload success to true
      alert("File uploaded and info saved to Firestore successfully!");
      // Reset file input visually by clearing its value
      setFile(null);
      document.getElementById('fileInput').value = '';
    } catch (error) {
      console.error("Error uploading file or saving file info to Firestore:", error);
      alert("Error uploading file or saving file info.");
    }
  };

  return (
    <>
    <div style={{
        paddingBottom: '100px',  // 这里设定一个比 footer 更高的底部内边距
      }}>
    <Box className="header"
        sx={{ 
            backgroundColor: 'white',
            display: 'flex',
            position: 'sticky',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 100,
            // justifyContent: 'space-between',
            alignItems: 'center',
            padding: '10px 20px',
        }}>
        <img 
            src='WWLogo.jpg' 
            alt="Logo" 
            style={{ width: '50px', cursor: 'pointer', marginRight: '10px' }}
         />
            <Typography variant="h6" sx={{
                color: 'black',
                fontWeight: 'bold',
                fontFamily: 'Arial, sans-serif',
                margin: 0, // 确保文本没有额外的外边距
                display: 'inline' // 保持文本在同一行
            }}>
                Wardrobe Wizard
            </Typography>
        {currentUser ? (
          <>
            <select onChange={(e) => {
              if (e.target.value === 'myCloset') {
                navigate('/myCloset');
              } else if (e.target.value === 'OOTD') {
                navigate('/ootd');
              } else if (e.target.value === 'Calendar') {
                navigate('/calendar');
              }
              else if (e.target.value === 'signOut') {
                handleSignOut();
              }
            }} /*style={{background: "none", border: "none", cursor: "pointer"}}*/
            style={{position: 'fixed',top: '30px',right: '15px', background: "none", border: "none", cursor: "pointer" }}
            >
              <option value="">{`Welcome, ${currentUser.displayName || 'User'}`}</option>
              <option value="myCloset">Account</option>
              <option value="myCloset">My Closet</option>
              <option value="OOTD">OOTD</option>
              <option value="Calendar">Calendar</option>
              <option value="signOut">Sign Out</option>
            </select>
          </>
        ) : (
          <>
            <div className="menuWrapper" style={{position: 'fixed',top: '30px',right: '15px'}}>
              {/*<Link to="/Home">Home</Link>*/}
              {/*<Link to="/VirtualCloset">Virtual Closet</Link>*/}
              {/*<Link to="/AboutUs">About Us</Link>*/}
              <Link to="/register" style={{ color: 'black', fontSize: '14px'}}>Sign Up |</Link>
              {/* <span style={{ color: 'black' }}>{" | "}</span> */}
              <Link to="/login" style={{ color: 'black',fontSize: '14px'}}>Login</Link>
              {/*<Link to="/Home" className="LogOUT">Logout</Link>*/}
          </div>
          </>
        )}
      </Box> 
        <div className="homePageBannerMain" style={{ 
          display: 'flex', 
          justifyContent: 'center',
          alignItems: 'center',
          height: 'auto', 
          minHeight: '100vh',
          width: '100%',
          objectFit: 'cover', 
           }}>
        <img 
        className="homePageBanner" 
        src="/homepage.webp" 
        alt="Homepage Banner"
        style={{ maxWidth: '100%', height: 'auto'}} 
        />
        </div>
        <div
         style={{height: '80px', width: '100%'}}
        >
        </div>
 
        <div className="containerMiddle" style={{
          height:'650px', 
          width: '50%', 
          margin: '0 auto',
          marginTop: '20px',
          marginBottom: '20px',
          backgroundColor: '#fff8f8',
          padding: '80px',
          borderRadius: '10px',
          border: '1px solid #e0e0e0',
          }}>
          {/*<div className="containerH1">*/}
          {/*</div>*/}
          <h1 style={{ textAlign: 'center'}}>Welcome to your AI Closet</h1>
          <h2 style={{ textAlign: 'center'}}>Neat enough! - Let us take care of removing clothes background</h2>
          <p>Please select a category and upload your clothes</p>  
          <select value={mainCategory} onChange={handleMainCategoryChange} required>
          <option value="">Select Main Category</option>
          {Object.keys(CLOTHING_CATEGORIES).map((category) => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>

        {mainCategory && (
          <select value={category} onChange={handleSpecificCategoryChange} required>
            <option value="">Select Specific Category</option>
            {CLOTHING_CATEGORIES[mainCategory].map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        )}
          <p>Please upload your clothes</p>
          {/* Bootstrap - requires to run inside frontend folder: npm install react-bootstrap bootstrap */}
          {/*
          <Form.Group controlId="formFileLg" className="mb-3">
          <Form.Label>Upload Image</Form.Label>
          <Form.Control type="file" size="lg"  onChange={handleFileChange}/>
          </Form.Group>*/}      
          <input className="chooseImage" type="file" onChange={handleFileChange} id="fileInput"/>
          {file && <><br/> <button style={{ marginTop:'10px'}} onClick={handleConfirm}>Confirm Image</button></>}
          <p>Supported formats: .jpg, .png, .jpeg, .bmp, .webp</p>
          {/* <div>
            {lastUploadedFile && (
              <p style={{ color: 'red', fontSize: '12px' }}>
                Last uploaded file: ({lastUploadedFile.category}), {lastUploadedFile.name}
              </p>
            )}
          </div> */}
          <div>
            {removeBgProcessing && <p style={{ color: 'red', fontSize: '12px'}}>{removeBgProcessing}</p>}
          </div>
          <div className="confirmUpload" style={{marginBottom: '100px'}}>
            {previewUrl && (
              <>
                <img className="imageUploaded" src={previewUrl} alt="Preview" style={{ marginTop:'10px', marginBottom:'20px',maxWidth: '100%', maxHeight: '300px'}}/>
                {/*ref={bottomRef} */}
                {processedFile &&   <button id="saveImage"  onClick={handleUpload}>Save to Closet</button>}
              </>
            )}
            {uploadSuccess && <p style={{ color: 'red', fontSize: '12px', marginBottom:'100px'}}>Last uploaded file: ({lastUploadedFile?.category}), {lastUploadedFile?.name} has been saved to your closet!</p>}
          </div>
          {/*{uploadSuccess && <p style={{ color: 'red', fontSize: '12px' }}>Last uploaded file: ({lastUploadedFile?.category}), {lastUploadedFile?.name} has been saved to your closet!</p>}*/}
          </div>
          <div className="homePageBannerMain" style={{ 
          display: 'flex', 
          justifyContent: 'center',
          alignItems: 'center',
          height: 'auto', 
          minHeight: '100vh',
          width: '100%',
          objectFit: 'cover', 
           }}>
        <img 
        className="homePageBanner" 
        src="/outfit.png" 
        alt="outfit Banner"
        style={{ maxWidth: '100%', height: 'auto'}} 
        />
        </div>
        </div>
        {/*<footer className="footer">Footer Content Will Go Here</footer>*/}
        {/* </Box> */}
        <div className="footer" style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: '50px',
        backgroundColor: 'black',
        color: 'white',
        textAlign: 'center',
        padding: '20px',
      }}>
          <div className='social-media-icons'>
            <img src="/facebook.png" alt="facebook icon" />
            <img src="/instagram.png" alt="instagram icon" />
            <img src="/linkedin.png" alt="linkedin icon" />
          </div>
        </div>
    </>
  );
};

export default Home;


{/* <select className="selectCategory" value={category} onChange={(e) => setCategory(e.target.value)} required>
          <option value="">Select Category</option>
          <option value="T-shirts">T-shirts</option>
          <option value="Longsleeves">Longsleeves</option>
          <option value="Tank tops">Tank tops</option>
          <option value="Hoodies">Hoodies</option>
          <option value="Blouses">Blouses</option>
          <option value="Blazers & Vests">Blazers & Vests</option>
          <option value="Sweaters">Sweaters</option>
          <option value="Jeans">Jeans</option>
          <option value="Pants">Pants</option>
          <option value="Agency pant">Agency pant</option>
          <option value="Shorts">Shorts</option>
          <option value="Jackets">Jackets</option>
          <option value="Coats">Coats</option>
          <option value="Overcoats">Overcoats</option>
          <option value="Skirts">Skirts</option>
          <option value="Dresses">Dresses</option>
          <option value="Shoes">Shoes</option>
          <option value="Boots">Boots</option>
          <option value="Leather shoes">Leather shoes</option>
          <option value="Sandals">Sandals</option>
          <option value="Sneakers">Sneakers</option>
          <option value="Heels">Heels</option>
          <option value="Hats">Hats</option>
          <option value="Bags">Bags</option>
          <option value="Earings">Earings</option>
          <option value="Accessories">Accessories</option>
          </select> */}