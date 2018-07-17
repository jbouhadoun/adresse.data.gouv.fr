import React from 'react'
import PropTypes from 'prop-types'

import Meta from '../meta'

class Infos extends React.Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    licenseLabel: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    valid: PropTypes.bool,
    error: PropTypes.object
  }

  static defaultProps = {
    valid: null,
    error: null
  }

  render() {
    const {id, status, licenseLabel, valid, error} = this.props

    return (
      <div>
        <Meta id={id} status={status} license={licenseLabel} valid={valid} error={error} />
      </div>
    )
  }
}

export default Infos
