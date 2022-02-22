import axios from 'axios';
import React, { Component } from 'react'
import { BASE_URL } from '../apiBaseUrl';
import '../stylesheets/style.css';
import '../stylesheets/event.css';
import EventInfo from '../components/Events/EventInfo'
import EventComments from '../components/Events/EventComments'
import SeatedBooking from '../components/EventBooking/SeatedBooking';
import SingleEventMap from '../components/Events/SingleEventMap';
import {DateTime} from "luxon";
import {AdvancedImage} from '@cloudinary/react';
import {Cloudinary} from "@cloudinary/url-gen";

// Import any actions required for transformations.
import {fill} from "@cloudinary/url-gen/actions/resize";

const cld = new Cloudinary({
  cloud: {
    cloudName: 'tickt-project22' //process.env.cloudinary_cloudname
  }
});


export default class Event extends Component {

  state = {
    loading: true,
    event: {
      venue:{},
      tickets:[],
      comments:[]
    },
    ticketsLeft: 0
  }

  fetchOneEvent = async ()=>{
    const url = `${BASE_URL}/events/${this.props.match.params.id}`

    try {
      const res = await axios.get(url)
      console.log('fetchOneEvent()',res.data);
      this.setState({event: res.data})
      
      this.setState({ticketsLeft: this.state.event.event_type? this.state.event.venue.standing_capacity - this.state.event.tickets.length : this.state.event.venue.seat_rows * this.state.event.venue.seat_columns - this.state.event.tickets.length})

      this.setState({loading: false})

    } catch (err) {
      console.log('ERROR FETCHING ONE EVENT: ', err);
    }
  }

  componentDidMount(){
    this.fetchOneEvent()
    
  }
  
  // Adds a new comment to state after posting to server
  newComment = (newComment)=>{
    let {event} = this.state
    event.comments.push(newComment)
    this.setState({event: event} )
  }


  render() {
    const myImage = cld.image(this.image); 
    
     
    return (
      <div className="pages-wrapper">
        {
          this.state.loading
          ?
          <div>Loading...</div>
          :
          <div>
            <h3>{this.state.event.name}</h3>
            <p>{`${this.state.event.venue.name}, ${DateTime.fromISO(this.state.event.date).toLocaleString(DateTime.DATE_HUGE)}`}</p>
            
            <div className="image-map-container">
            {/* <AdvancedImage cldImg={myImage} /> */}
              <div className="event-image"><p>REPLACE WITH EVENT IMAGE ONCE WE WORK OUT CLOUDINARY</p></div>
              <SingleEventMap className="event-map" venue={this.state.event.venue} />
            </div>

            <div className="event-info-comments-container">
              <div className="event-info">
                <EventInfo event={this.state.event} ticketsLeft={this.state.ticketsLeft} />
              </div>
              <div className="event-comments">
                <EventComments 
                  comments={this.state.event.comments} 
                  currentUser={this.props.currentUser}
                  eventId={this.state.event.id}
                  newComment={this.newComment}
                   />
              </div>
            </div>
            {!this.state.event.event_type && <SeatedBooking 
                                                event={this.state.event} 
                                                currentUser={this.props.currentUser} 
                                                fetchOneEvent={this.fetchOneEvent} 
                                                history={this.props.history}/>}

          </div>
        }
      </div>
    )
  }
}
