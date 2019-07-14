import React from 'react'
import axios from 'axios'
import FilmSelect from '../films/FilmSelect'
import Auth from '../../lib/Auth'
import { Link } from 'react-router-dom'
import LocationEntry from './LocationEntry'

const initialState = {
  location: {
    coordinates: {},
    sceneNotes: []
  },
  errors: {},
  message: null,
  film: {},
  selectedFilm: null,
  activeLocation: {}
}

class LocationNew extends React.Component {

  constructor(props){
    super(props)

    this.state = {...initialState},

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.getFilm = this.getFilm.bind(this)
  }
  getFilm(film){
    const selectedFilm = {...film}
    const films = []
    films.push(film.value)
    const sceneNotes = []
    sceneNotes.push({...this.state.location.sceneNotes, film: film.value})
    const location = {...this.state.location, films, sceneNotes}
    this.setState({selectedFilm, location})
  }


  handleChange(e){
    let location = this.state.location
    let sceneNotes = []
    switch(true){
      case (e.name === 'areaOfLondon'):
        location = {...this.state.location, [e.name]: e.value}
        break
      case (!!e.target.dataset.sceneNotes):
        sceneNotes = []
        sceneNotes.push({...this.state.location.sceneNotes[0], [e.target.name]: e.target.value})
        location = {...this.state.location, sceneNotes}
        break
      default:
        location = {...this.state.location, [e.target.name]: e.target.value}
    }
    this.setState({ location })
  }


  handleSubmit(e) {
    e.preventDefault()
    const token = Auth.getToken()
    axios.get('https://api.opencagedata.com/geocode/v1/json', {
      params: {
        key: process.env.OPENCAGE_API_TOKEN,
        q: this.state.location.streetAddress,
        countrycode: 'gb',
        proximity: '51.5074, 0.1278'
      }
    })
      .then(res => {
        if(res.data.results[0]) {
          const location = {
            ...this.state.location,
            coordinates: {
              lng: res.data.results[0].geometry.lng,
              lat: res.data.results[0].geometry.lat
            }
          }
          this.setState({ location })
        } else {
          const streetAddress = ''
          const location = {...this.state.location, streetAddress}
          this.setState({ location })
        }
      })
      .then(() => {
        return axios.post('api/locations', this.state.location, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      })
      .then((res) => {
        this.setState({message: 'Location created'})
        console.log(res.data)
        setTimeout(() => {
          this.setState({ ...initialState })
          this.props.addNewLocationToIndex()
        }, 2000)
      })
      .catch(err => {
        const errors = { ...err.response.data.errors }
        this.setState({ errors })
      })
  }



  render(){
    return(
      <section>
        <div className="column">
          <div className="title is-4">Create a new film location</div>
          {!Auth.isAuthenticated() &&
            <div>
              <p className="content">You need to be logged in to create a new film location</p>
              <Link to="/login"><p>Log in now</p></Link>
            </div>
          }
          {Auth.isAuthenticated() && <form onSubmit={this.handleSubmit}>
            {!this.state.selectedFilm &&<FilmSelect
              handleChange={this.getExistingFilm}
              handleFilmImage={this.handleFilmImage}
              getFilm={this.getFilm}
            />}
            {this.state.selectedFilm &&
              <LocationEntry
                errors={this.state.errors}
                selectedFilm={this.state.selectedFilm}
                handleChange={this.handleChange}
                handleSubmit={this.handleSubmit}
              />
            }
          </form>
          }
        </div>
        {this.state.message &&
          <div className="notification is-success">Location created!</div>
        }
      </section>
    )
  }
}

export default LocationNew


// {this.state.message &
//   <div className="notification is-success">{this.state.message}</div>
// }
