// @flow

import React from 'react'
import type { Element } from 'react'
import styles from './styles.module.css'

export const ExampleComponent = ({ text }): Element => {
  return <div className={styles.test}>Example Component: {text}</div>
}
