import React from 'react'
import styles from './styles.css'

const ExampleComponent: React.FC<ExampleComponentProps> = ({text}) =>
  <div className={styles.test}>Example Component: {text}</div>

type ExampleComponentProps = {
  text: string
}

export default ExampleComponent
