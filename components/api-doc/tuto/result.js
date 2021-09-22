import PropTypes from 'prop-types'
import React from 'react'
import copy from 'copy-to-clipboard'

import theme from '../../../styles/theme'

import Code from '../code'

import Loader from '../../loader'
import InputExample from './input-example'

function Result({example, results, isLoading}) {
  return (
    <div className='result-container'>
      <InputExample value={example} copy={copy} />
      {isLoading ?
        <div className='loading-pre'>
          <div className='loading-code'>
            <Loader />
          </div>
        </div> :
        <Code code={JSON.stringify(results, null, 2)} />}
      <style jsx>{`
        .result-container {
          display: flex;
          flex-direction: column;
        }

        .loading-pre {
          background: ${theme.colors.white};
          border: 1px solid ${theme.backgroundGrey};
          border-radius: 5px;
          width: 100%;
          padding: 1em;
          margin-bottom: 1em;
        }

        .loading-code {
          width: 100%;
          height: 360px;
          background: ${theme.backgroundGrey};
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
      `}</style>
    </div>
  )
}

export default Result
