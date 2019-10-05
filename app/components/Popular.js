import React from 'react'
import PropTypes from 'prop-types'
import { fetchPopularRepos } from '../utils/api'
import { GoPerson, GoStar, GoGitBranch, GoIssueOpened } from 'react-icons/go'
import Card from './Card'
import Loading from './Loading'
import Tooltip from './Tooltip'

function LanguagesNav({ selectedLanguage, onUpdateLanguage }) {
  const languages = ['All', 'JavaScript', 'Ruby', 'Java']
  return (
    <ul className="flex-center">
      {languages.map(lang => (
        <li key={lang}>
          <button
            className="btn-clear nav-link"
            style={
              lang == selectedLanguage ? { color: 'blue' } : { color: 'red' }
            }
            onClick={() => onUpdateLanguage(lang)}>
            {lang}
          </button>
        </li>
      ))}
    </ul>
  )
}

LanguagesNav.propTypes = {
  selectedLanguage: PropTypes.string.isRequired,
  onUpdateLanguage: PropTypes.func.isRequired
}

function ReposGrid({ repos }) {
  return (
    <ul className="grid space-around">
      {repos.map((repo, index) => {
        const {
          name,
          owner,
          html_url,
          stargazers_count,
          forks,
          open_issues
        } = repo
        const { login, avatar_url } = owner
        return (
          <li key={html_url}>
            <Card
              header={`#${index + 1}`}
              avatar={avatar_url}
              name={login}
              href={html_url}>
              <ul className="card-list">
                <li>
                  <Tooltip text="Github username">
                    <GoPerson color="#666" size={22} />
                    <a href={`https://github.com/${login}`}>{login}</a>
                  </Tooltip>
                </li>
                <li>
                  <GoStar color="#666" size={22} />
                  {stargazers_count.toLocaleString()} stars
                </li>
                <li>
                  <GoGitBranch color="#666" size={22} />
                  {forks.toLocaleString()} forks
                </li>
                <li>
                  <GoIssueOpened color="#666" size={22} />
                  {open_issues.toLocaleString()} open issues
                </li>
              </ul>
            </Card>
          </li>
        )
      })}
    </ul>
  )
}

ReposGrid.propTypes = {
  repos: PropTypes.array.isRequired
}

export default class Popular extends React.Component {
  state = {
    selectedLanguage: 'All',
    repos: {},
    error: null
  }

  componentDidMount() {
    this.updateLanguage(this.state.selectedLanguage)
  }

  isLoading = () => {
    const { repos, selectedLanguage, error } = this.state
    return !repos[selectedLanguage] && error == null
  }

  updateLanguage = lang => {
    this.setState({
      selectedLanguage: lang,
      error: null
    })

    if (!this.state.repos[lang]) {
      fetchPopularRepos(lang)
        .then(data => {
          this.setState(({ repos }) => ({
            repos: {
              ...repos,
              [lang]: data
            }
          }))
        })
        .catch(() => {
          console.warn('Error: there was an error fetching popular repos.')
          this.setState({
            error: 'There was an error fetching popular repos.'
          })
        })
    }
  }

  render() {
    const { repos, selectedLanguage, error } = this.state
    return (
      <React.Fragment>
        <LanguagesNav
          onUpdateLanguage={this.updateLanguage}
          selectedLanguage={selectedLanguage}
        />

        {this.isLoading() && <Loading text="Fetching repos" />}
        {error && <p className="center-text error">{error}</p>}
        {repos[selectedLanguage] && (
          <ReposGrid repos={repos[selectedLanguage]} />
        )}
      </React.Fragment>
    )
  }
}
