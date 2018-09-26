import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { ReactComponent as ReactIcon } from './react-icon.svg'

import styles from './styles.css'

export default class ExampleComponent extends Component {
  static propTypes = {
    text: PropTypes.string
  }

  render() {
    const {
      text
    } = this.props

    return (
      <div className={styles.test}>
        Example Component: {text}
        <ReactIcon />
      </div>
    )
  }
}
