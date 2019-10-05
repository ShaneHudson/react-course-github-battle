import React from 'react'
import { battle } from '../utils/api'
import Card from './Card'
import PropTypes from 'prop-types'
import Loading from './Loading'
import Tooltip from './Tooltip'
import queryString from 'query-string'
import { Link } from 'react-router-dom'

function ProfileList({ profile }) {
  return (
    <ul className="card-list">
      <li>{profile.name}</li>
      {profile.location && (
        <li>
          <Tooltip text="Location">{profile.location}</Tooltip>
        </li>
      )}
      {profile.company && (
        <li>
          <Tooltip text="Company">{profile.company}</Tooltip>
        </li>
      )}
      <li>{profile.followers.toLocaleString()} followers</li>
      <li>{profile.following.toLocaleString()} following</li>
    </ul>
  )
}

ProfileList.propTypes = {
  profile: PropTypes.object.isRequired
}

export default class Results extends React.Component {
  state = {
    winner: null,
    loser: null,
    error: null,
    loading: true
  }

  componentDidMount() {
    const { playerOne, playerTwo } = queryString.parse(
      this.props.location.search
    )

    battle([playerOne, playerTwo])
      .then(players => {
        this.setState({
          winner: players[0],
          loser: players[1],
          error: null,
          loading: false
        })
      })
      .catch(({ message }) => {
        this.setState({
          error: message,
          loading: false
        })
      })
  }

  render() {
    const { winner, loser, error, loading } = this.state

    if (loading) {
      return <Loading text="Battling" />
    }

    if (error) {
      return <p className="center-text error">{error}</p>
    }

    return (
      <React.Fragment>
        <div className="grid space-around container-sm">
          <Card
            header={winner.score == loser.score ? 'Draw' : 'Winner'}
            avatar={winner.profile.avatar_url}
            subheader={`Score: ${winner.score.toLocaleString()}`}
            name={winner.profile.login}
            href={winner.profile.html_url}>
            <ProfileList profile={winner.profile}></ProfileList>
          </Card>

          <Card
            header={winner.score == loser.score ? 'Draw' : 'Loser'}
            avatar={loser.profile.avatar_url}
            subheader={`Score: ${loser.score.toLocaleString()}`}
            name={loser.profile.login}
            href={loser.profile.html_url}>
            <ProfileList profile={loser.profile}></ProfileList>
          </Card>
        </div>
        <Link to="/battle" className="btn dark-btn btn-space">
          Reset
        </Link>
      </React.Fragment>
    )
  }
}
