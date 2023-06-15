import jwtDecode from 'jwt-decode';
import React, { useEffect, useState } from 'react';
import { CgetToken} from '../Cauth'
import axios from 'axios';
import { styled, keyframes } from "@mui/material/styles";
import { Button, TextField, Typography } from '@mui/material';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import { Link } from "react-router-dom";

import { BarChart, Delete, Edit, Visibility } from "@mui/icons-material";




const Pretext = styled(Typography)(({ theme }) => ({
    opacity: 0,
    transition: 'opacity 2s ease-in-out, transform 1s ease-in-out',
    animation: '$slideDown 1s ease-in-out',
    transform: 'translateY(-50%)',
    '&.visible': {
      opacity: 1,
      transform: 'translateY(0)',
    },
    '@keyframes slideDown': {
      '0%': {
        opacity: 0,
        transform: 'translateY(-50%)',
      },
      '100%': {
        opacity: 1,
        transform: 'translateY(0)',
      },
    },
  }));
  
  const GradientAnimation = keyframes`
  0% {
    background-position: 0 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0 50%;
  }
  `;
  
  const Span = styled('span')(({ theme }) => ({
    background: `linear-gradient(-45deg, #0077be, #00ad7c ,#0077be)`,
    backgroundSize: '400% 400%',
    animation: `${GradientAnimation} 3s ease-in-out infinite`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  }));

const TestQCM = () => {
    const [userId, setUserId] = useState(null);
    const [showText, setShowText] = useState(false);
    const [examNameStorage, setExamNameStorage] = useState([]);

    const token = CgetToken();

    useEffect(() => {
      
      if (token) {
      const decodedToken = jwtDecode(token);
      setUserId(decodedToken.id);
      }
      }, []);


      useEffect(() => {
        const timeoutId = setTimeout(() => {
          if (!showText) {
            setShowText(true);
          }
        }, 200);

        const handleScroll = () => {
          const offsetY = window.pageYOffset;
          const screenHeight = window.innerHeight;
          const textPosition = document.querySelector('.text').offsetTop;
          if (offsetY > textPosition - screenHeight / 2) {
            setShowText(true);
            window.removeEventListener('scroll', handleScroll);
            clearTimeout(timeoutId);
          }
        };
    
        window.addEventListener('scroll', handleScroll);
        return () => {
          window.removeEventListener('scroll', handleScroll);
          clearTimeout(timeoutId);
        };
      }, [showText]);

      const [testName, setTestName] = useState('');


    
      const handleTestNameChange = (event) => {
        setTestName(event.target.value);
      };
      const getExamNames = async () => {
        const { data } = await axios.get(`http://localhost:5000/exam/${userId}`);
        setExamNameStorage(data);
      }
      
      const deleteExam = (id) => {
        axios.delete(`http://localhost:5000/exam/${id}`).then((response) => {
          console.log(response.status);
          console.log(response.data);
        });
      }
      useEffect(() => {
        getExamNames();
      }, [testName]);

      const handleSubmit = async (event) => {
        event.preventDefault();
        try {
          if (testName == "") {
            alert("If you want to create an exam you have to give it a name")
          } else {
            const newExam = {
              creatorUserId: userId,
              examname: testName,
            };
            console.log(newExam)
            axios.post("http://localhost:5000/exam/", newExam).then((response) => {
              console.log(response.status);
              console.log(response.data);
            });
          }
        } catch (error) {
          console.error('Error:', error);
        }
      };


  return (
    <React.Fragment>

<Pretext sx={{
            marginTop: 14,  textAlign: "center", fontFamily: "Oswald", fontWeight: "bold", fontSize: 44,
          }} className={`text ${showText ? 'visible' : ''}`}>
            Upload A <Span>Test QCM</Span> If It's Needed
          </Pretext>

<form onSubmit={handleSubmit}>
<Typography sx={{marginTop: 2 , marginLeft: 12, color:"black", fontFamily:"Oswald"}}>
          Test Name
        </Typography>
        <TextField
            type="text"
            label="Test Name"
            name="evalname"
            value={testName}
          onChange={handleTestNameChange}
            sx={{marginTop: 2 , width: '38%', marginLeft: 12}}
          />
      <Button type="submit" variant='contained' sx={{color:"white", backgroundColor:"black", "&:hover": {color:"black", backgroundColor:"white"}, ml:12, mt:4, mb:10}} >Submit Test</Button>
      <Typography sx={{marginTop: 2 , marginLeft: 12, color:"black", fontFamily:"Oswald"}}>
          List of Tests
        </Typography>
        <TableBody>
  {examNameStorage.map((name) => (
    <tr key={name.examname}>
      <td >
        <span style={{ cursor: "pointer" }} >
          {name.examname} 
        </span>
      </td>
      <td align="right">
        <Link to={`/anlyze/${name._id}`}>
          <Button>
            <BarChart style={{ verticalAlign: "middle", padding: "5px" }} />
            Analyze
          </Button>
        </Link>
      </td>
      <td align="right">
        <Link to={`/create/${name._id}/${userId}`}>
          <Button>
            <Edit style={{ verticalAlign: "middle", padding: "5px" }} />
            Edit
          </Button>
        </Link>
      </td>
      <td align="right">
        <Button onClick={() => { deleteExam(name._id); }}>
          <Delete style={{ verticalAlign: "middle", padding: "5px" }} />
          Delete
        </Button>
      </td>
    </tr>
  ))}
</TableBody>

    </form>
    </React.Fragment>
  );
};

export default TestQCM;
