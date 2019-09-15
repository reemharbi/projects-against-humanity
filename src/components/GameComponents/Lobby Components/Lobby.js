import React, { Component } from 'react'
import RoomsList from './RoomsList'
import LobbyHeader from './LobbyHeader/LobbyHeader';
import UserName from './UserName';
import Game from './Game/Game';
import { Container, Grid } from 'semantic-ui-react';
import {
    createPlayer,
    updatePlayer,
    getAllRooms,
    getRoom,
    createRoom,
} from './api'
import socketIOClient from "socket.io-client";
import endpoint from '../../../socket';
import './Lobby.css';
import './Game/AnimatedBG.css'

export default class Lobby extends Component {


    constructor(props) {
        super(props);
        this.userNameHandler = this.userNameHandler.bind(this)
        this.socket = null;

    }



    state = {
        rooms: [],
        roomsToDisplay: [],
        roomName: "",
        user: null,
        userName: '',
        currentComponent: 'user', //this is initially setting the current component to username
        role: true,
        filterContent: "",
        currentRoom: null

    }

    refreshRoom() {

    }

    getAllRoomsAPI = () => {
        getAllRooms().then(res => {

            const roomsStateArray = res.data.rooms;
            this.setState({
                rooms: roomsStateArray,
                roomsToDisplay: roomsStateArray

            }
            )
        })
    }

    componentWillMount() {
        this.getAllRoomsAPI();
    }


    // A function to handle the room adding functionality
    addRoom = (value) => {
        value.preventDefault();
        const newRoom = {
            name: this.state.roomName,
            players: [{ "_id": this.state.user._id }]

        }

        createRoom(newRoom).then(res => {
            this.setState({
                currentRoom: res.data.room,
                currentComponent: "game",
                roomName: ""
            })
            this.socket.emit("createNewRoom", res.data.room._id)
            this.getAllRoomsAPI();
        })

    }

    initUser = (value) => {
        value.preventDefault();

        const newPlayer = { name: this.state.userName }

        createPlayer(newPlayer).then(res => {
            this.setState({ user: res.data.player });
            this.socket = socketIOClient(endpoint, { query: `userId=${this.state.user._id}` });
            // changing currentComponent to the room component
            this.setState({
                currentComponent: 'room'
            });

        });
    }

    userNameHandler = (e) => {
        this.setState({

            userName: e.target.value
        })
        console.log('*', this.state.userName)
    }


    // The function that changes the state to allow the user to type in the text field.
    onChangeHandler = (e) => {
        this.setState({
            roomName: e.target.value
        })
        console.log(this.state.roomName);
    }

    //Changes the component to enter a room
    enterRoom = (roomID) => {
        console.log('room ID', roomID);
        this.socket.emit("joinRoom", { roomID: roomID, userID: this.state.user._id });

        let joinedRoom = null;

        //Checks if the player successfully joined the room 
        this.socket.on("playerJoinedRoom", (receivedRoomId) => {

            getRoom(roomID).then(res => {
                joinedRoom = res.data.room;
                console.log("join room function", joinedRoom)
                this.setState({
                    currentComponent: 'game',
                    currentRoom: joinedRoom

                })
            }).catch(err => {
                console.log(err)
            });
        })



        this.socket.on("playerFailedToJoin", () => {
            alert("Sorry, the game is full..")
        })


    }

//

    exitGame = () => {


        this.socket.emit("playerExitRoom", { roomID: this.state.currentRoom._id, userID: this.state.user._id });


        this.setState({
            currentComponent: 'room',
            currentRoom: null
        })
    }

    roomsFilter = (e) => {
        const newFilterValue = e.target.value;

        this.setState((prevState, props) => {
            const filteredRooms = prevState.rooms.filter(room => {
                return room.name.toLowerCase().includes(newFilterValue.toLowerCase());
            });
            return {
                filterContent: newFilterValue,
                roomsToDisplay: filteredRooms
            };
        });


    }

    updateRoom = (roomID) => {
        let joinedRoom = null;
        getRoom(roomID).then(res => {
            console.log("this is the update room again...", res.data.room)
            joinedRoom = res.data.room;
            this.setState({
                currentRoom: joinedRoom

            })
        }).catch(err => {
            console.log(err)
        });
    }
    
    
        updateCurrentRoom = (roomId) => {
    
            console.log("Update current room, for room: ", roomId)
            getRoom(roomId).then(res => {
                this.setState({
                    currentRoom: res.data.room
                });
                const user = this.state.currentRoom.players.find((player) => {
                    return player._id === this.state.user._id;
                });
                console.error("what is user: ", user)
                
                if (this.state.currentRoom.players.length === this.state.currentRoom.limit &&
                    !user.ready) {
                        console.error(user.name, " is trying")
     
                    updatePlayer(user._id, { ready: true }).then(res => {
                        console.error(user.name, " is ready")
                        this.socket.emit("playerIsReady", this.state.currentRoom);
                    });
    
                }
            });
    
        }
    render() {

        const username = this.state.user && this.state.user.name
        
        // now we're checking which component to display based on currentComponent from state
        if (this.state.currentComponent === 'user') {
            return (<div>
                <UserName userName={this.state.userName} onChange={this.userNameHandler} initUser={this.initUser} />
            </div>)
        } else if (this.state.currentComponent === 'room') {
            return (
                <Container center>
                <div class="bg"></div>
                <div class="bg bg2"></div>
                <div class="bg bg3"></div>
                    <Grid textAlign='center' style={{ marginTop: '5rem', color: 'white', fontWeight: 'bold' ,marginBottom: '5rem', fontSize: '7rem', fontFamily: 'Amatic SC, bold'  }} verticalAlign='middle'>Welcome {username}! </Grid>
                    <LobbyHeader roomName={this.state.roomName} onChangeAdd={this.onChangeHandler} addRoom={this.addRoom} onChangeFilter={this.roomsFilter} val={this.state.filterContent} />
                    <RoomsList rooms={this.state.roomsToDisplay} enterRoom={this.enterRoom} socket={this.socket} getAllRoomsAPI={this.getAllRoomsAPI} />
                </Container>              
            )
        }

        
        
        else if (this.state.currentComponent === 'game') {
            
            return (<div>
                <Game user={this.state.user} exitGame={this.exitGame} room={this.state.currentRoom} socket={this.socket} updateRoom={this.updateRoom} updateCurrentRoom={this.updateCurrentRoom} />
            </div>
            )
        }
    }
}