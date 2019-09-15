import React, { Component } from 'react'
import Investor from './InvestorView'
import ProjectManager from './ProjectManagerView'
import './Game.css'
import Waiting from './Waiting';
import Disconnected from './Disconnected';
import InvestorFinalPhase from './InvestorFinalPhase';
import ProjectManagerFinalView from './ProjectManagerFinalView';
import { Button } from 'semantic-ui-react'

export default class Game extends Component {

  state = {
    currentCard: null,
    currentComponent: 'waiting',
    finalPhase: false,
    playersInRoom: [],
    investor: null
  }
//


  


  componentDidMount() {
    

    this.props.socket.on("updateCurrentRoom", (roomID) => this.props.updateCurrentRoom(roomID));

    this.props.socket.on("startGame" , (card) => {
      let currentUser = null;
      this.props.room.players.forEach( (player) => {
            if (player.role === 'inv'){
              this.setState({
                investor: player
              })
            }
            console.log("the investor is :" , player , "???")
          
          if (player._id === this.props.user._id)
          currentUser = player
            
      })
      console.log("currentUser is:" , currentUser)
 
      if (currentUser.role === "inv"){
        this.setState({
          currentCard: card,
          currentComponent: 'investor'
        })
      }

      else{
        this.setState({
          currentCard: card,
          currentComponent: 'project manager'
        })

      }
    
    })

    this.props.socket.on("finalPhase" , (players) => {
      this.setState({
        playersInRoom: players,
        finalPhase: true
      })
    })



  }


  render() {


    
    if (this.state.finalPhase) {
      
  if (this.state.currentComponent === 'investor') {
    return <div>
    <InvestorFinalPhase room={this.props.room} socket={this.props.socket} players={this.state.playersInRoom} card={this.state.currentCard}/>
    <div style={{width:'100px', margin: '0px auto'}}>
<Button color='yellow' style={{color:'black', marginTop:'1rem', marginRight: '1rem'}} className="exit-button ui fluid button" onClick={this.props.exitGame}>EXIT GAME</Button>
</div>

  </div>
  }
  else{
    return <div>
       <ProjectManagerFinalView socket={this.props.socket} players={this.state.playersInRoom} card={this.state.currentCard}/>
       <div style={{width:'100px', margin: '0px auto'}}>
        <Button color='yellow' style={{color:'black', marginTop:'1rem', marginRight: '1rem'}} className="exit-button ui fluid button" onClick={this.props.exitGame}>EXIT GAME</Button>
        </div>
     
    </div>
  }




    }
else {

  if (this.state.currentComponent === 'investor') {
    return <div>
        <Investor exitGame={this.props.exitGame} card={this.state.currentCard} room={this.props.room} updateRoom={this.props.updateRoom} socket={this.props.socket} />
        <div style={{width:'100px', margin: '0px auto'}}>

        <Button color='yellow' style={{color:'black', marginTop:'1rem', marginRight: '1rem'}} className="exit-button ui fluid button" onClick={this.props.exitGame}>EXIT GAME</Button>
        </div>
      </div>
    }
    else if (this.state.currentComponent === 'project manager') {
      return <div>
        <ProjectManager investor={this.state.investor} exitGame={this.props.exitGame} card={this.state.currentCard} room={this.props.room} updateRoom={this.props.updateRoom} socket={this.props.socket} user={this.props.user}/>
        <div style={{width:'100px', margin: '0px auto'}}>
        <Button color='yellow' style={{color:'black', marginTop:'1rem', marginRight: '1rem'}} className="exit-button ui fluid button" onClick={this.props.exitGame}>EXIT GAME</Button>
        </div>
     
      </div>
    }
    
    else if(this.state.currentComponent === 'waiting'){
      return (
              <>
      <div>
        <Waiting exitGame={this.props.exitGame} room={this.props.room}/>
        </div>
        <div>
        <div style={{height:'100px', width:'100px', margin: '0px auto'}}>
        <Button color='yellow' style={{color:'black', marginTop:'1rem', marginRight: '1rem'}} className="exit-button ui fluid button" onClick={this.props.exitGame}>EXIT GAME</Button>
        </div>
        </div>
    </>)
}
else if (this.state.currentComponent === 'disconnected player'){
  return <Disconnected />
  
}
}
}
}
