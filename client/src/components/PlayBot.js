import React, { useEffect, useState } from 'react';

const PlayBot = ({ username, socket, room }) => {
    const [power, setPower] = useState(50);
    const [winner, setWinner] = useState("");
    const [showRoomInfo, setShowRoomInfo] = useState(true);

    useEffect(() => {
        socket.on("power_update", (data) => {
            setPower(data.power);

            if (data.power >= 100) {
                socket.emit("user_win", { room: room, username: username });
                setWinner(username);
                setTimeout(() => {
                    // Code that executes after 2 seconds
                    console.log("2 seconds have passed.");
                    setShowRoomInfo(false);
                    socket.disconnect();
                }, 2000);

                setPower(50);


            }

            // Check if another user wins and disconnects the server
            if (data.power <= 0) {
                socket.emit("user_win2", { room: room, username: username });
                setWinner(username);
                setTimeout(() => {
                    // Code that executes after 2 seconds
                    console.log("2 seconds have passed.");
                    setShowRoomInfo(false);
                    socket.disconnect();
                }, 5000);

                setPower(50);


            }
        });

        socket.on("disconnect", () => {
            console.log("Disconnected from the server");
        });

        return () => {
            socket.off("receive_message");
            socket.off("power_update");
            socket.off("disconnect");
        };
    }, [socket, username, room]);

    const sendMessage = async () => {
        const data = {
            room: room,
            username: username,
        };
        await socket.emit("send_message", data);
    };

    return (
        <div>
            {showRoomInfo && (
                <div>
                    <h1 className="text-center text-secondary">Compete your clicking speed!</h1>
                    <br />
                    <br />
                    <div>
                        <h2 className="text-success">
                            {winner === "" ? `Try ` : ` ${winner}  wins the game`}
                        </h2>

                        <div className="progress" style={{ height:"100px" }}>
                            <div className="progress-bar bg-danger" style={{ width: `${power}%` }}>
                                {power}
                            </div>
                            <div className="progress-bar bg-warning" style={{ width: `${100 - power}%` }}>
                                {100 - power}
                            </div>
                        </div>
                        <br />
                        <br />
                        <div className="d-grid gap-2 col-6 mx-auto">
                            <button className="btn btn-primary" type="button" onClick={sendMessage}>
                                Button
                            </button>
                        </div>
                        <br />
                        <br />
                    </div>
                    <br />
                    <br />
                </div>
            )}
        </div>
    );
};

export default PlayBot;
