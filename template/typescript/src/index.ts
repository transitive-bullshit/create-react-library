import React from 'react'
import styles from './styles.css'

export const ExampleComponent = ({ text: string }) => {
  return <div className={styles.test}>Example Component: {text}</div>
}
