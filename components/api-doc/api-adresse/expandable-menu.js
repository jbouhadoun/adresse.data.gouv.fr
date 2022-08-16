import {useState} from 'react'
import PropTypes from 'prop-types'
import {ChevronDown, ChevronUp} from 'react-feather'

import theme from '../../../styles/theme'

function ExpandableMenu({title, children, label}) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <button
      type='button'
      aria-label={`${isExpanded ? 'Masquer' : 'Afficher'} la documentation de ${label}`}
      className='expandable-menu-container' onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className='head'>
        <div className='title'>{title}</div>
        <div style={{paddingLeft: '.5em'}}>
          {isExpanded ? (
            <ChevronUp style={{verticalAlign: 'middle'}} size={38} alt aria-hidden='true' />
          ) : (
            <ChevronDown style={{verticalAlign: 'middle'}} size={38} alt aria-hidden='true' />
          )}
        </div>
      </div>

      {isExpanded && children}

      <style jsx>{`
        .expandable-menu-container {
          width: 100%;
          margin: 0.5em 0;
          padding: 0.5em;
          background: ${theme.colors.white};
          border-radius: 3px;
          color: ${theme.darkText};
          border: none;
          text-align: left;
        }

        .expandable-menu-container:hover {
          cursor: pointer;
        }

        .head {
          display: flex;
          justify-content: space-between;
          display: flex;
          align-items: center;
          min-height: 2em;
        }

        .title {
          font-size: 16px;
          font-weight: 600;
          width: 100%;
        }
        `}</style>
    </button>
  )
}

ExpandableMenu.propTypes = {
  title: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node
  ]).isRequired,
  label: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired
}

export default ExpandableMenu
