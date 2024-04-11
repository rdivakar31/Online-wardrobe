import React, { useState, useContext, useEffect } from 'react';
import { getFirestore, doc, collection, query, where, getDocs, setDoc } from "firebase/firestore";
import { AuthContext } from "../firebase/Auth";
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import { useNavigate } from "react-router-dom";
import ReactCalendar from 'react-calendar'; 
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import { doSignOut } from "../firebase/FirebaseFunctions"; 
import "./Calendar.css";

const CalendarPage = () => {
  const currentUser = useContext(AuthContext);
  const [outfits, setOutfits] = useState([]); 
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedOutfit, setSelectedOutfit] = useState(null);
  const [dateOfoutfit, setDateOfoutfit] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      if (!currentUser) {
        console.log("No user found");
        return;
      }
      const db = getFirestore();
      const outfitColRef = collection(db, "OOTD");
      const q = query(outfitColRef, where("user_id", "==", currentUser.uid));
      const querySnapshot = await getDocs(q);
      let tempOutfits = [];
      querySnapshot.forEach((doc) => {
        tempOutfits.push({ id: doc.id, ...doc.data() }); 
      });
      setOutfits(tempOutfits);
    };
    fetchData();
  }, [currentUser]);

  useEffect(() => {
    const fetchData = async () => {
      if (!currentUser) {
        console.log("No user found");
        return;
      }
      const db = getFirestore();
      const userCalendarRef = doc(db, "Calendar", currentUser.uid);
      const datesCollectionRef = collection(userCalendarRef, "dates");
      const querySnapshot = await getDocs(datesCollectionRef);
      let tempOutfits = [];
      querySnapshot.forEach((doc) => {
        tempOutfits.push({ date: doc.id, ...doc.data() });
      });
      setDateOfoutfit(tempOutfits); // 使用正确的状态更新函数
    };
    fetchData();
  }, [currentUser]);
  
  

  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      // Find outfits for the specific date
      const dateString = date.toISOString().split('T')[0]; // Format the date to match the 'YYYY-MM-DD' format
      const outfitForDate = dateOfoutfit.find(outfit => outfit.date === dateString);
      console.log("Outfit for date: ", outfitForDate);
  
      // If there's an outfit for this date, return a thumbnail or some indication
      if (outfitForDate) {
        return (
          <div className="titleImage">
            <img src={outfitForDate.url} alt="Outfit"/>
          </div>
        );
      }
    }
    // For days without outfits or for views that aren't 'month', nothing is customized
    return null;
  };
  

  const onDayClick = (value) => {
    setSelectedDate(value);
    setModalOpen(true);
    setSelectedOutfit(null);
  };

  const handleSaveOutfit = async () => {
    if (!currentUser || !selectedOutfit) {
      alert("No user found or no outfit selected");
      return;
    }
  
    const outfitData = {
      url: selectedOutfit.outfit_url,
      date: selectedDate.toISOString().split('T')[0], // Format date as YYYY-MM-DD
      name: selectedOutfit.file_name,
      user_id: currentUser.uid,
      outfitId: selectedOutfit.id
    };
  
    try {
      const db = getFirestore();
      // Reference the 'dates' subcollection within the user's document in the 'Calendar' collection
      const userCalendarRef = doc(db, "Calendar", currentUser.uid);
      const datesCollectionRef = collection(userCalendarRef, "dates");
      const dateDocRef = doc(datesCollectionRef, outfitData.date);
      console.log("Attempting to write to path: ", `Calendar/${currentUser.uid}/dates/${outfitData.date}`);
      await setDoc(dateDocRef, outfitData); // Saving the outfit data as a document with the date as the document ID
      
      // Here, we update the `dateOfoutfit` state with the new outfit data
      setDateOfoutfit(prevOutfits => {
        const existingOutfitIndex = prevOutfits.findIndex(outfit => outfit.date === outfitData.date);
        const newOutfits = [...prevOutfits];
        if(existingOutfitIndex >= 0) {
          newOutfits[existingOutfitIndex] = outfitData; // Update existing outfit
        } else {
          newOutfits.push(outfitData); // Add new outfit
        }
        return newOutfits;
      });

      alert('Outfit saved for the day!');
      setSelectedOutfit(null);
      setModalOpen(false);
    } catch (error) {
      console.error('Error saving outfit: ', error);
      alert('Error saving outfit for the day.');
    }
  };
  
  

  const handleSelect = (outfit) => {
    setSelectedOutfit(outfit);
  }

  const handleSignOut = () => {
    doSignOut();
    navigate("/");
    alert("You have been signed out");
  };

  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '66%',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    overflow: 'scroll',
    height: '75%',
  };

  return (
    <Box sx={{ flexGrow: 1, paddingLeft: '20px' }}>
      {/* Dropdown menu and other components omitted for brevity */}
      {currentUser && (
      <select
          onChange={(e) => {
              if (e.target.value === "Calendar") {
                  navigate("/calendar");               
              }else if (e.target.value === "OOTD") {
                navigate("/OOTD");
              }else if(e.target.value === "myCloset") {
                navigate("/myCloset");
              }else if (e.target.value === "home") {
                  navigate("/");
              } else if (e.target.value === "signOut") {
                  handleSignOut(); 
              }
          }}
          style={{ position: 'absolute', top: 10, right: 10 }}
      >
          <option value="Calendar">Calendar</option>
          <option value="OOTD">OOTD</option>
          <option value="myCloset">My Closet</option>
          <option value="home">Home</option>
          <option value="signOut">Sign Out</option>
        </select>
      )}

      <Box className="calendarContainer">
        <ReactCalendar
          className="calendar"
          onChange={setSelectedDate}
          value={selectedDate}
          tileContent={tileContent}
          onClickDay={onDayClick}
        />
        <Modal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={modalStyle}>
            <Grid container spacing={2}>
              {outfits.map((outfit, index) => (
              <Grid item xs={4} sm={3} key={index}>
                  <Card sx={{ maxWidth: 345, height: 345, position: 'relative' }}>
                      <CardMedia
                          component="img"
                          image={outfit.outfit_url}
                          alt="outfit"
                          sx={{ width: '100%', height: 'auto' }}
                      />
                      <FormControlLabel
                          control={
                          <Checkbox
                            checked={!!(selectedOutfit && selectedOutfit.id === outfit.id)}
                            onChange={() => handleSelect(outfit)}
                            name="checkedB"
                            color="primary"
                          />
                         }
                            label=""
                            style={{ position: 'absolute', bottom: 10, left: 10 }}
                            />
                        </Card>
                          </Grid>
                          ))}
                        </Grid>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px', marginBottom: '10px' }}>
                          <Button onClick={handleSaveOutfit} variant="contained" color="primary">
                            Save for the day
                            </Button>
                        </Box>
                        </Box>
                        </Modal>
                        </Box>
                      </Box>
                         );
                    }
export default CalendarPage;




