import React from 'react'
import { Link } from 'react-router-dom'
import { GoOrganization, GoRocket, GoLaw, GoX } from 'react-icons/go'
import PropTypes from 'prop-types'
import Results from './Results'
import { ThemeConsumer } from '../contexts/theme'

function Instructions() {
  return (
    <ThemeConsumer>
      {({ theme }) => (
        <div className="instructions-container">
          <h1 className="enter-text header-lg">Instructions</h1>
          <ol className="container-sm grid-center-text battle-instructions">
            <li>
              <h3 className="header-sm">Enter two GitHub users</h3>
              <GoOrganization
                className={`bg-${theme}`}
                color="#666"
                size={140}
              />
            </li>
            <li>
              <h3 className="header-sm">Battle</h3>
              <GoRocket className={`bg-${theme}`} color="#666" size={140} />
            </li>
            <li>
              <h3 className="header-sm">See the winners</h3>
              <GoLaw className={`bg-${theme}`} color="#666" size={140} />
            </li>
          </ol>
        </div>
      )}
    </ThemeConsumer>
  )
}

class PlayerInput extends React.Component {
  state = {
    username: ''
  }

  handleSubmit = event => {
    event.preventDefault()
    this.props.onSubmit(this.state.username)
  }

  handleChange = event => {
    this.setState({
      username: event.target.value
    })
  }

  render() {
    return (
      <ThemeConsumer>
        {({ theme }) => (
          <form className="column player" onSubmit={this.handleSubmit}>
            <label htmlFor="username" className="player-label">
              {this.props.label}
            </label>
            <div className="row player-inputs">
              <input
                type="text"
                id="username"
                className={`input-${theme}`}
                placeholder="github username"
                autoComplete="off"
                value={this.state.username}
                onChange={this.handleChange}
              />

              <button
                className={`btn btn-${theme}`}
                type="submit"
                disabled={!this.state.username}>
                Submit
              </button>
            </div>
          </form>
        )}
      </ThemeConsumer>
    )
  }
}

PlayerInput.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired
}

function PlayerPreview({ username, onReset, label }) {
  return (
    <ThemeConsumer>
      {({ theme }) => (
        <div className="ccolumn player">
          <h3 className="player-label">{label}</h3>
          <div className={`row bg-${theme}`}>
            <div className="player-info">
              <img
                src={`https://github.com/${username}.png?size=200`}
                alt={`Avatar for ${username}`}
                className="avatar-small"
              />
              <a href={`https://github.com/${username}`} className="link">
                {username}
              </a>
            </div>
            <button className="btn-clear flex-center" onClick={onReset}>
              <GoX color="#666" size={26} />
            </button>
          </div>
        </div>
      )}
    </ThemeConsumer>
  )
}

PlayerPreview.propTypes = {
  username: PropTypes.string.isRequired,
  onReset: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired
}

export default class Battle extends React.Component {
  state = {
    playerOne: null,
    playerTwo: null
  }

  handleSubmit = (id, player) => {
    this.setState({
      [id]: player
    })
  }

  handleReset = id => {
    this.setState({
      [id]: null
    })
  }

  render() {
    const { playerOne, playerTwo } = this.state

    return (
      <ThemeConsumer>
        {({ theme }) => (
          <React.Fragment>
            <Instructions />

            <div className="players-container">
              <h1 className="center-text header-lg">Players</h1>

              <div className="row space-around">
                {playerOne === null ? (
                  <PlayerInput
                    label="Player 1"
                    onSubmit={player => this.handleSubmit('playerOne', player)}
                  />
                ) : (
                  <PlayerPreview
                    username={playerOne}
                    onReset={() => this.handleReset('playerOne')}
                    label="Player 1"
                  />
                )}

                {playerTwo === null ? (
                  <PlayerInput
                    label="Player 2"
                    onSubmit={player => this.handleSubmit('playerTwo', player)}
                  />
                ) : (
                  <PlayerPreview
                    username={playerTwo}
                    onReset={() => this.handleReset('playerTwo')}
                    label="Player 2"
                  />
                )}
              </div>

              {playerOne && playerTwo && (
                <Link
                  className={`btn ${theme}-btn btn-space`}
                  to={{
                    pathname: '/battle/results',
                    search: `?playerOne=${playerOne}&playerTwo=${playerTwo}`
                  }}>
                  Battle
                </Link>
              )}
            </div>
          </React.Fragment>
        )}
      </ThemeConsumer>
    )
  }
}
