import React, { useState, useEffect } from "react";
import baseUrl from "../urls/baseUrl";
import { useCookies } from "react-cookie";
import { Audio, BallTriangle } from "react-loader-spinner";

function Dashboard() {
  const [cookies, setCookie, removeCookie] = useCookies(["yoga"]);
  const [data, setData] = useState({ name: "", email: "" });
  const [slot, setSlot] = useState([]);
  const [date, setDate] = useState({ year: 2022, month: 12 });
  const [payment, setPayment] = useState({ status: "pending", amount: 500 });
  const [history, setHistory] = useState([]);
  const [nextSlot, setNextSlot] = useState({ year: 2023, month: 1, slot: 1 });

  useEffect(() => {
    var d = new Date();
    setDate({ year: d.getFullYear(), month: d.getMonth() + 1 });
    console.log(date);
    var y = date.year;
    var m = date.month;
    if (date.month === 12) {
      y = date.year + 1;
      m = 1;
    } else {
      m = date.month + 1;
    }
    const setUp = async () => {
      console.log(cookies.yoga);
      if (!cookies.yoga) {
        window.location.href = "/";
      } else {
        var session = await fetch(baseUrl + "users/get", {
          method: "POST",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: cookies.yoga.email }),
        });
        session = await session.json();
        setData(session.data);
        var slotData = await fetch(baseUrl + "time-slots", {
          method: "POST",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
            authorization: "Bearer " + cookies.yoga.token,
          },
          body: JSON.stringify({
            email: cookies.yoga.email,
            year: date.year,
            month: date.month,
          }),
        });
        slotData = await slotData.json();
        console.log(slotData);
        setSlot(slotData.data.slot);

        var paymentData = await fetch(baseUrl + "payments/get", {
          method: "POST",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
            authorization: "Bearer " + cookies.yoga.token,
          },
          body: JSON.stringify({
            email: cookies.yoga.email,
            year: date.year,
            month: date.month,
          }),
        });
        paymentData = await paymentData.json();
        console.log(paymentData);
        if (paymentData.data.status === "success") {
          setPayment({
            status: paymentData.data.status,
            amount: paymentData.data.amount,
          });
        }

        var historyData = await fetch(baseUrl + "payments/all", {
          method: "POST",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
            authorization: "Bearer " + cookies.yoga.token,
          },
          body: JSON.stringify({ email: cookies.yoga.email }),
        });
        historyData = await historyData.json();
        console.log(historyData);
        setHistory(historyData.data);

        var nextSlotData = await fetch(baseUrl + "time-slots", {
          method: "POST",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
            authorization: "Bearer " + cookies.yoga.token,
          },
          body: JSON.stringify({
            email: cookies.yoga.email,
            year: y,
            month: m,
          }),
        });
        nextSlotData = await nextSlotData.json();
        console.log(nextSlotData);
        setNextSlot({ year: y, month: m, slot: nextSlotData.data.slot });
      }
    };
    setUp();
  }, []);

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const makePayment = async () => {
    setPayment({ status: "processing" });
    var paymentData = await fetch(baseUrl + "payments", {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer " + cookies.yoga.token,
      },
      body: JSON.stringify({
        email: cookies.yoga.email,
        year: date.year,
        month: date.month,
        amount: 500,
      }),
    });
    await delay(5000);
    paymentData = await paymentData.json();
    setPayment({
      status: paymentData.data.status,
      amount: paymentData.data.amount,
    });
  };

  const updateSlot = async (slot) => {
    console.log("update slot called");
    var y = date.year;
    var m = date.month;
    if (date.month === 12) {
      y = date.year + 1;
      m = 1;
    } else {
      m = date.month + 1;
    }
    var slotData = await fetch(baseUrl + "time-slots/book", {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer " + cookies.yoga.token,
      },
      body: JSON.stringify({
        email: cookies.yoga.email,
        year: y,
        month: m,
        slot: slot,
      }),
    });
    slotData = await slotData.json();
    console.log(slotData);
    setSlot(slotData.data.slot);
  };

  return (
    <div className="container justify-content-center">
      <div className="row mt-3 justify-content-center">
        <div className="col-6 justify-content-center">
          <h1>Dashboard</h1>
        </div>
        <div className="col-6 d-flex justify-content-end">
          <input
            className="btn btn-danger"
            type="button"
            value="Logout"
            onClick={() => {removeCookie("yoga"); window.location.href = "/";}}
          />
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <p>Name:- {data.name}</p>
          <p>Email:- {data.email}</p>
          <p>Age:- {data.age}</p>
          <p>
            Current Slot{" "}
            {slot === 1 ? (
              <>6:00 AM - 7:00 AM</>
            ) : (
              <>
                {slot === 2 ? (
                  <>7:00 AM - 8:00 AM</>
                ) : (
                  <>
                    {slot === 3 ? (
                      <>8:00 AM - 9:00 AM</>
                    ) : (
                      <>5:00 PM - 6:00 PM</>
                    )}
                  </>
                )}
              </>
            )}
          </p>
          <p>
            Current Payment Status - ₹{payment.amount} {payment.status}
          </p>
          {payment.status === "pending" || payment.status === "failed" ? (
            <>
              <button
                className="btn btn-primary"
                value="Pay Now"
                onClick={() => makePayment()}
              >
                Pay Now
              </button>
            </>
          ) : (
            <>
              {payment.status === "processing" ? (
                <>
                  <BallTriangle
                    height="80"
                    width="80"
                    radius="3"
                    color="#e31e42"
                    ariaLabel="ball-triangle-loading"
                  />
                </>
              ) : (
                <></>
              )}
            </>
          )}

          <div>
            <h2>Next Month</h2>
            <select
              className="form-select"
              name="Slot"
              value={nextSlot.slot}
              onChange={(e) => updateSlot(e.target.value)}
            >
              <option value="1">6:00 AM - 7:00 AM</option>
              <option value="2">7:00 AM - 8:00 AM</option>
              <option value="3">8:00 AM - 9:00 AM</option>
              <option value="4">5:00 PM - 6:00 PM</option>
            </select>
          </div>
          <div className="mt-3">
            <h2>Payment History</h2>
            <hr />
            <table className="table table-striped">
              <thead>
                <tr>
                  <th scope="col">Transaction Time</th>
                  <th scope="col">Month</th>
                  <th scope="col">Year</th>
                  <th scope="col">Amount</th>
                  <th scope="col">Status</th>
                </tr>
              </thead>
              <tbody>
                {history.map((item, index) => {
                  return (
                    <tr key={index}>
                      <td>{item.createdAt}</td>
                      <td>{item.month}</td>
                      <td>{item.year}</td>
                      <td>{item.amount}</td>
                      <td>{item.status}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
