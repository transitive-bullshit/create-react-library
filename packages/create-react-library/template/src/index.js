import React from 'react'
import PropTypes from 'prop-types'

import styles from './styles.css'

const ExampleComponent = ({ text }) =>
  <div className={styles.test}>Example Component: {text}</div>


ExampleComponent.propTypes = {
  text: PropTypes.string
}

export default ExampleComponent
