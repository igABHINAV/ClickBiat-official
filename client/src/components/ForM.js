import React, { useState } from 'react'
import io from "socket.io-client"
import PlayBot from './PlayBot'
const socket = io.connect("http://localhost:5000")
const ForM = () => {
  const [username, setusername] = useState("")
  const [room, setroom] = useState("")
  const [isRoomJoined, setIsRoomJoined] = useState(false);
  const [roomfull , setr] = useState(false);
  const JoinRoom = async () => {
    if (username !== "" && room !== "") {
      socket.emit("join_room", room)
    }
  }
  socket.on("room_joined", (data) => {
    console.log(`You joined the room ${data.room}`);
    setIsRoomJoined(true);
  });
  socket.on("room_full", (data) => {
    console.log(`Room ${data.room} is full. Cannot join.`);
    // Handle room full case if necessary (e.g., show an error message)
    setr(true);
  });
  return (
    <div >

      <>
        <br />
        <div className='container border' >
          <h4>Join Room</h4>
          {/* Section: Design Block */}
          <section className=" text-center text-lg-start">
            <style
              dangerouslySetInnerHTML={{
                __html:
                  "\n    .rounded-t-5 {\n      border-top-left-radius: 0.5rem;\n      border-top-right-radius: 0.5rem;\n    }\n\n    @media (min-width: 992px) {\n      .rounded-tr-lg-0 {\n        border-top-right-radius: 0;\n      }\n\n      .rounded-bl-lg-5 {\n        border-bottom-left-radius: 0.5rem;\n      }\n    }\n  "
              }}
            />
            <div className="card mb-3">
              <div className="row g-0 d-flex align-items-center">
                
                <div className="col-lg-8">
                  <div className="card-body py-5 px-md-5">
                    <form>
                      {/* Email input */}
                      <div className="form-outline mb-4">
                        <input
                          type='text' id="form2Example1"
                          className="form-control" placeholder='username' value={username} onChange={(e) => setusername(e.target.value)}
                        />
                        <label className="form-label" htmlFor="form2Example1">
                          Username
                        </label>
                      </div>
                      {/* Password input */}
                      <div className="form-outline mb-4">
                        <input
                          id="form2Example1"
                          className="form-control" type='text' placeholder='room' value={room} onChange={(e) => setroom(e.target.value)}
                        />
                        <label className="form-label" htmlFor="form2Example2">
                          Room
                        </label>
                      </div>
                      {/* 2 column grid layout for inline styling */}
                      {/* Submit button */}
                      <button type="button" onClick={JoinRoom} className="btn btn-primary btn-block mb-4">
                        Join
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </section>
          {roomfull ? (<div className='text-danger text-center'>Room is full</div>) :(isRoomJoined && <PlayBot socket={socket} username={username} room={room} />) }
          {/* {isRoomJoined && <PlayBot socket={socket} username={username} room={room} />} */}
          {/* Section: Design Block */}

        </div></>
    </div>
  )
}

export default ForM
