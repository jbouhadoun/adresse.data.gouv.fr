import React from 'react'
import Router from 'next/router'
import PropTypes from 'prop-types'
import debounce from 'debounce'

import api from '../../lib/api'

import Section from '../section'
import SearchInput from '../search-input'
import Notification from '../notification'
import renderCommune from '../search-input/render-commune'
import Commune from './commune'

class Explorer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      input: '',
      results: [],
      commune: props.data,
      loading: false,
      error: null
    }

    this.handleInput = this.handleInput.bind(this)
    this.handleSearch = this.handleSearch.bind(this)
    this.handleSelect = this.handleSelect.bind(this)

    this.handleSearch = debounce(this.handleSearch, 200)
  }

  update() {
    this.setState({results: [], loading: true, error: null})
    const fields = 'fields=code,nom,codesPostaux,surface,population,centre,contour,departement,region'

    this.setState(state => {
      state.query = `communes?nom=${state.input}&${fields}&boost=population`
      this.handleSearch()
    })
  }

  handleSelect(item) {
    this.setState({input: item.nom, commune: item})
    this.update()
    const href = `/explore?code=${item.code}`
    const as = `/explore/commune/${item.code}`
    Router.push(href, as, {shallow: true})
  }

  handleInput(input) {
    this.setState({input})
    this.update()
  }

  async handleSearch() {
    const {query} = this.state
    const url = 'https://geo.api.gouv.fr/'

    try {
      const results = await api(url, query)
      this.setState({
        results: results.splice(0, 5) || []
      })
    } catch (err) {
      this.setState({
        results: [],
        error: err
      })
    }
    this.setState({loading: false})
  }

  render() {
    const {input, results, commune, loading, error} = this.state

    return (
      <Section>
        <SearchInput
          value={input}
          results={results}
          loading={loading}
          placeholder='Rechercher une commune…'
          onSelect={this.handleSelect}
          onSearch={this.handleInput}
          renderItem={renderCommune}
          getItemValue={item => item.nom} />

        {error &&
          <div className='error'>
            <Notification message={error.message} type='error' />
          </div>
          }

        {commune && <Commune {...commune} />}
        <style jsx>{`
            .error {
              margin: 1em 0;
            }
          `}</style>
      </Section>
    )
  }
}

Explorer.propTypes = {
  data: PropTypes.object
}

Explorer.defaultProps = {
  data: null
}

export default Explorer
