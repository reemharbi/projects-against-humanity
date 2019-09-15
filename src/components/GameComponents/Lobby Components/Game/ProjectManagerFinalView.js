import React, { Component } from 'react'
import { Card, Grid, Image } from 'semantic-ui-react'
import './InvestorView.css'
import './AnimatedBG.css'

export default class ProjectManagerFinalView extends Component {



    state = {
        winner: ""
    }


    componentDidMount(){
        this.props.socket.on("gameResult" , (winner) => {

            this.setState({
                winner: `The winner is ${winner.name}!!!`
            })

        })
    }


    render() {
        return (
            <div>
                <p>{this.state.winner}</p>

    <Grid columns={3}>
    <Grid.Row style={{paddingBottom: '0px'}}>
      <Grid.Column>
            <div className='card-div'>
                <Card className="project-card flip-vertical-right">
                    <div className="project-text text-flip">{this.props.card.title}</div>
                </Card>
            </div>
      </Grid.Column>
      <Grid.Column>
      <Image centered style={{marginTop:'1rem'}} src='https://react.semantic-ui.com/images/wireframe/square-image.png' size='tiny' circular />
      </Grid.Column>
    </Grid.Row>
    
    <Grid.Row style={{paddingBottom: '0px', paddingTop: '0px'}}>
        <Grid.Column>
            <div style={{height:'8vh'}}>
            </div>  
        </Grid.Column>
        <Grid.Column>
            <p className='fade-in-fwd scale-out-center'>Phase 1</p>
        </Grid.Column>
    </Grid.Row>
    <Grid.Row style={{paddingBottom: '0px', paddingTop: '0px', height:'9vh'}}>
        <Grid.Column>
            <div>
                <Card style={{paddingBottom: '0px'}} className="project-card player-card">
                <p>{this.props.players[1].approach}</p>
                </Card>
            </div>
       </Grid.Column>
       <Grid.Column>
            <div>
            </div>
       </Grid.Column>
       <Grid.Column>
            <div>
                <Card style={{paddingBottom: '0px'}} className="project-card player-card p2">
                
                <p>{this.props.players[0].approach}</p>
                </Card>
            </div>
       </Grid.Column>

    </Grid.Row>

        </Grid>

        <div class="bg"></div>
        <div class="bg bg2"></div>
        <div class="bg bg3"></div>

    </div>
        )
    }
}
//