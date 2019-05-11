// This is the base template
// Components are referenced within this.
// It is a classical component as we need a constructor
// Renders the map and includes the sidebar, add location button, register/login

import React from 'react'
import axios from 'axios'

import Map from './Map'
import LocationIndex from './LocationIndex'
// import LocationShow from './LocationShow'



class Home extends React.Component {

  constructor(){
    super()

    this.state = {
      locations: null,
      center: {
        lat: -0.070839,
        long: 51.515619
      },
      toggleSidebar: false
    }

    this.handleClick = this.handleClick.bind(this)
    this.toggleSidebarClick = this.toggleSidebarClick.bind(this)
  }

  componentDidMount() {
    axios.get('/api/locations')
      .then(res => this.setState({ locations: res.data }))
      .catch(err => console.error(err))
  }

  handleClick(e){
    const lat = e.target.dataset.lat
    const long = e.target.dataset.long
    this.setState( { center: { lat: lat, long: long } } )
    // console.log('center HOME', this.state.center)
    // console.log('coordinates INDEX', data)
    this.toggleSidebarClick = this.toggleSidebarClick.bind(this)
  }

  toggleSidebarClick(){
    console.log('clicked')
    this.setState({ toggleSidebar: !this.state.toggleSidebar})
  }

  render() {
    // console.log('HOME locations', this.state.locations)
    if (!this.state.locations) return <h1>Loading...</h1>
    return (
      <main>
        <div>
          <div className={`sidebar-wrapper${this.state.toggleSidebar ? ' close': ''}`}>
            <div className="sidebar">
              <h1>On Set London</h1>
              <hr />
              <LocationIndex data={this.state.locations} handleClick={this.handleClick} />
            </div>
            <div className="togglewrapper">
              <a role="button" className="togglebutton" onClick={this.toggleSidebarClick}>x</a>
            </div>
          </div>
        </div>
        <div className="map">
          <Map data={this.state} />
        </div>
      </main>

    )
  }
}

export default Home
