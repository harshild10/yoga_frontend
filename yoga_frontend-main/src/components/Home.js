import React, { useState, useEffect } from "react";
import baseUrl from "../urls/baseUrl";
import { useCookies } from "react-cookie";

function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [cookies, setCookie] = useCookies(["yoga"]);

  useEffect(() => {
    if (cookies.yoga) {
      window.location.href = "/dashboard";
    }
  }, [cookies.yoga]);

  const login = async () => {
    emailValidation(email);
    passwordValidation(password);
    if (emailError === true || passwordError === true) {
      return;
    }
    var session = await fetch(baseUrl + "users/login", {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    session = await session.json();
    if (session.status === 201) {
      setCookie("yoga", session.data, { path: "/" });
      window.location.href = "/dashboard";
    } else {
      alert("Invalid Credentials");
    }
  };

  const passwordValidation = (val) => {
    if (val === "") {
      setPasswordError(true);
    } else {
      setPasswordError(false);
    }
    setPassword(val);
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
                    onChange={(e) => {
                      passwordValidation(e.target.value);
                    }}
                  />
                </div>
              </div>
              <div className="row mt-3 justify-content-center">
                <div className="col-md-6 col-6 justify-content-center">
                  <button
                    type="submit"
                    class="btn btn-primary mb-3"
                    onClick={login}
                  >
                    Login{" "}
                  </button>
                </div>
              </div>
              <div className="row mt-3 justify-content-center">
                <div className="col-md-6 col-6 justify-content-center">
                  <button
                    type="submit"
                    class="btn btn-warning mb-3"
                    onClick={() => {
                      window.location.href = "/register";
                    }}
                  >
                    Register
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

export default Home;
