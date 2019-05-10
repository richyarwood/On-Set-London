import React from 'react'
import ReactDOM from 'react-dom'
import Home from './components/common/Home'
import LocationNew from './components/common/LocationNew'
import { HashRouter as Router, Switch, Route } from 'react-router-dom'

import { library } from '@fortawesome/fontawesome-svg-core'
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons'

library.add(faPlusCircle)

import 'bulma'
import './style.scss'

class App extends React.Component{
  render(){
    return(
      <Router>
        <Switch>
          <Route path="/new" component={LocationNew} />
          <Route path="/" component={Home} />
        </Switch>
      </Router>
    )
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
)
