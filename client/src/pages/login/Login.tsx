import './data.scss';
import React, {useState} from 'react';
import {md5} from 'hash-wasm';
import {Link} from "react-router-dom";
import Navbar from "../../components/navbar/Navbar";
import * as EmailValidator from 'email-validator';

interface userInterface {
   email: string,
   password: string,
}

const authenticateEmail1 = (user: userInterface) => {
    if (!EmailValidator.validate(user.email)) {
        return false
    } else if (user.email.length === 0) {
        return false;
    } else if (user.password.length === 0) {
         return false;
     } else {
     return true;
    }
}



function Login() {
  // TODO: all 'useState's' can be combined to track form + in signup form
  // used to track state of different fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // used to update state of form
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => { setEmail(e.target.value); }
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => { setPassword(e.target.value); }

  // await md5 w/ import above used to get md5 hash of passowrd
  async function submit(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    // let user_data;
    let user_data : {[key: string]: any }= {email: "", password: ""};
    // gets data from inputs
    let user = {
        email: email,
        password: await md5(password),
    }

    if (!authenticateEmail1(user)) {
        alert("Invalid Login");
        return;
    }

    console.log(user);
    await fetch(
        "http://localhost:3009/record/verifyLogin", {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
        })
        .then( response=> response.json())
        .then(jsonData => { console.log(jsonData); user_data = jsonData; })
        .catch(error => {
            window.alert(error);
        });

      if (user_data.hasOwnProperty("errorMessage")) {
          if (user_data['errorMessage'] === "email not found") {
              alert("Email Not Found");
              return;
          } else if (user_data['errorMessage'] === "incorrect password") {
              alert("Incorrect Password");
              return;
          } else if (user_data['errorMessage'] === "unknown error has occurred") {
              alert("unknown error has occurred");
              return;
          } else {
              alert("unknown error")
              return;
          }
      } else {
        sessionStorage.setItem('email',user_data['email']);
        sessionStorage.setItem('name',user_data['name']);
        sessionStorage.setItem('content',JSON.stringify(user_data['content']));
        sessionStorage.setItem('properties',JSON.stringify(user_data['properties']));

        window.open("profile")
        }

  }

  return (
      <>
          <Navbar/>
          <div id="login-form">
              <h4>Login</h4>
              <input type="email" id="email" placeholder="Email" required onChange={(e) => {handleEmailChange(e)}}></input>
              <input type="password" id="password" placeholder="Password" required onChange={(e) => {handlePasswordChange(e)}}></input>
              <button onClick={submit}>login</button>
              <div>
                  <p>Dont have an account?</p>
                  <a
                      className="App-link"
                      href={window.location.origin + "/signup"}
                      target="_blank"
                      rel="noopener noreferrer"
                  >Signup</a>
              </div>
              <br/>
              {/*<h4>to be implemented</h4>*/}
              {/*<h4 style={{fontSize: "15px"}}>Forgot Password?</h4>*/}
          </div>
      </>
  );
}

export default Login;