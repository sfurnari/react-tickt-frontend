import React, { Component } from 'react'
import axios from 'axios';
import { BASE_URL } from '../../apiBaseUrl'


export default class StandingBooking extends Component {

  state = {
    ticketQuantity: 1,
  }

  purchaseTickets = async (tickets)=>{

    try {
      const res = await axios.post(`${BASE_URL}/tickets`, tickets)
      console.log('purchaseTickets()', res.data);
      this.props.history.push('/') //TODO: Make this redirect to the tickets
      
    } catch (err) {
      console.log('Error purchaseTickets()', err);
    }
    
  }

  onChange =  (e)=>{
    this.setState({ticketQuantity: parseInt(e.target.value)})
  }

  handleSubmit = (e)=>{
    e.preventDefault();
    const tickets = Array(this.state.ticketQuantity).fill({
      user_id: this.props.currentUser.id,
      event_id: this.props.event.id
    })

    this.purchaseTickets(tickets)
  }


  render() {
    return (
      <div className='standing-booking-container'>
        StandingBooking
        <form onSubmit={this.handleSubmit}>
          <input type="number" min="1" max="10" value={this.state.ticketQuantity} onChange={this.onChange}/>
          <button>Purchase</button>
        </form>
      </div>
    )
  }
}