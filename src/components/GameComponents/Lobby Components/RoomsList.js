import React, { Component } from 'react'
import Room from './Room'
import { Container, Grid } from 'semantic-ui-react'
import './RoomList.css'

export default class RoomsList extends Component {


   
    
    componentWillMount(){
        this.props.getAllRoomsAPI();
    }
    componentDidMount(){

        this.props.socket.on("updateDB" , this.props.getAllRoomsAPI )


    }



    render() {


        const roomsList = this.props.rooms.map((room , index) => {
          return <Grid.Column><Room enterRoom={this.props.enterRoom} name= {room.name} limit={room.limit} playerCount= {room.players.length} key={index} roomID={room._id}/></Grid.Column>
        })

        return (
           <Container center>

    <Grid columns={1}>
      <Grid.Row >
      {roomsList}
      </Grid.Row>
    </Grid>

    

    {/* Heads up! Override division color to make it visible on dark background. */}
             
    </Container>
        )
    }
}
