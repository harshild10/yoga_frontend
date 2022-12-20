import { useState } from "react";
import baseUrl from "../urls/baseUrl";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [age, setAge] = useState(0);
  const [ageError, setAgeError] = useState(false);
  const [slot, setSlot] = useState(1);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [date, setDate] = useState({ year: 2022, month: 12 });



  const passwordValidation = (val) => {
    if (val === "") {
      setPasswordError(true);
    } else {
      setPasswordError(false);
    }
    setPassword(val);
  };

  const confirmPasswordValidation = (val) => {
    if (val === "") {
      setPasswordError(true);
    } else {
      setPasswordError(false);
    }
    setConfirmPassword(val);
  };

  const regExEmail = (val) => {
    var res = val.match(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
    return res;
  };

  const emailValidation = (val) => {
    if (val === "") {
      setEmailError(true);
    }
    if (regExEmail(val) === null) {
      setEmailError(true);
    } else {
      setEmailError(false);
    }
    setEmail(val);
  };

  const ageValidation = (val) => {
    if (val < 18 || val > 65) {
      setAgeError(true);
    }
    else
      setAgeError(false);
    setAge(val);
  };


  const submit = async () => {
    emailValidation(email);
    passwordValidation(password);
    confirmPasswordValidation(confirmPassword);
    if(password !== confirmPassword){
      alert("Password and Confirm Password should be same")
    }
    console.log(name, email, emailError, password, passwordError, age, ageError, slot);
    if (emailError === false && passwordError === false && ageError === false) {
      var data = await fetch(baseUrl + "users/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password, age})
      });
      var res = await data.json();
      console.log(res);
      if (res.status === 200) {
        var d = new Date();
        var y = d.getFullYear();
        var m = d.getMonth() + 1;
        setDate({ year: y, month: m });
        var slotData = await fetch(baseUrl + "time-slots/book", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, slot, year: date.year, month: date.month})
        });
        var slotRes = await slotData.json();
        if (slotRes.status === 200) {
          alert("Registered Successfully");
          window.location.href = "/";
        }
      }
      alert("Registered Failed");
      return;
    }
    if (emailError === true) {
      alert("Please enter a valid email");
      return;
    }
    if (passwordError === true) {
      alert("Please enter a valid password");
      return;
    }
    if (ageError === true) {
      alert("Please enter age between 18- 65");
      return;
    }
    if (password !== confirmPassword) {
      alert("Password and Confirm Password should be same");
      return;
    }
  }

  return (
    <div className="container">
      <div className="row justify-content-center mt-5">
        <div className="col-md-6 col-12 justify-content-center">
          <div className="card">
            <div className="form-group justify-content-center mt-5 mb-5">
              <div className="row justify-content-center">
                <div className="col-md-6 col-6">
                  <h2>Yoga App</h2>

                  <label>Email: </label>
                  <input
                    className="form-control"
                    type="text"
                    name="email"
                    onChange={(e) => {
                      emailValidation(e.target.value);
                    }}
                  />
                </div>
              </div>
              <div className="row justify-content-center">
                <div className="col-md-6 col-6">
                  <label>Password: </label>
                  <input
                    className="form-control"
                    type="password"
                    name="password"
                    onChange={(e) => {passwordValidation(e.target.value)}}
                  />
                </div>
              </div>
              <div className="row justify-content-center">
                <div className="col-md-6 col-6">
                  <label>Confirm Password: </label>
                  <input
                    className="form-control"
                    type="password"
                    name="confirmPassword"
                    onChange={(e)=> {confirmPasswordValidation(e.target.value)}}
                  />{" "}
                </div>
              </div>{" "}
              <div className="row justify-content-center">
                <div className="col-md-6 col-6">
                  <label>Name: </label>
                  <input
                    className="form-control"
                    type="text"
                    name="name"
                    onChange={(e) => {setName(e.target.value)}}
                  />{" "}
                </div>
              </div>{" "}
              <div className="row justify-content-center">
                <div className="col-md-6 col-6">
                  <label>Age: </label>
                  <input className="form-control" type="text" name="age" onChange={(e)=> {ageValidation(e.target.value)}} />
                </div>
              </div>{" "}
              <div className="row justify-content-center mt-4">
                <div className="col-md-6 col-6">
                  {" "}
                  <select className="form-select" defaultValue={1} onChange={(e)=> {setSlot(e.target.value)}}>
                    <option value={1}>6:00 AM - 7:00 AM</option>
                    <option value={2}>7:00 AM - 8:00 AM</option>
                    <option value={3}>8:00 AM - 9:00 AM</option>
                    <option value={4}>5:00 PM - 6:00 PM</option>
                  </select>
                </div>
                
              </div>
              <div className="row mt-3 justify-content-center">
                <div className="col-md-6 col-6 justify-content-center">
                  <button
                    type="submit"
                    class="btn btn-primary mb-3"
                    onClick={submit}
                  >
                    Register{" "}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
