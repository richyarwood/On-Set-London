import React from 'react'
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import Map from './Map'
import LocationIndex from './LocationIndex'
import LoginLogout from './LoginLogout'
import LocationNew from './LocationNew'

class Home extends React.Component {

  constructor(){
    super()

    this.state = {
      locations: null,
      center: {
        lat: '51.520119',
        long: '-0.098549'
      },
      toggleSidebar: false,
      toggleRightBar: false,
      formMessage: ''
    }

    this.handleClick = this.handleClick.bind(this)
    this.toggleSidebarClick = this.toggleSidebarClick.bind(this)
    this.toggleRightBar = this.toggleRightBar.bind(this)
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
    this.toggleSidebarClick = this.toggleSidebarClick.bind(this)
  }

  toggleSidebarClick(message){
    console.log('clicked')
    this.setState({ toggleSidebar: !this.state.toggleSidebar, formMessage: message })
  }

  toggleRightBar() {
    this.setState({ toggleRightBar: !this.state.toggleRightBar })
  }

  render() {
    if (!this.state.locations) return <h1>Loading...</h1>
    console.log(this.state.toggleRightBar)
    return (
      <main>
        <div>
          <div className={`sidebar-wrapper${this.state.toggleSidebar ? ' close': ''}`}>
            <div className="sidebar">
              <img src="/images/on-set-london-logo.jpg" alt="On Set London movie Location database" />
              <hr />
              <LocationIndex data={this.state.locations} handleClick={this.handleClick} />
            </div>
            <div className="togglewrapper">
              <a role="button" className="togglebutton" onClick={this.toggleSidebarClick}>x</a>
            </div>
          </div>
        </div>

        <div>

          <div className={`right-sidebar-wrapper${this.state.toggleRightBar ? ' open': ''}`}>
            <div className="map-icon cancel" onClick={this.toggleRightBar}>
              <FontAwesomeIcon icon="times-circle" size="4x"/>
            </div>
            <div className="sidebar">
              <LocationNew />
            </div>
          </div>
        </div>
        <div className="map">
          <Map data={this.state} />
        </div>
        <div className="map-icon" onClick={this.toggleRightBar}>
          <FontAwesomeIcon icon="plus-circle" size="4x"/>
        </div>
        <LoginLogout />
      </main>

    )
  }
}

export default Home
