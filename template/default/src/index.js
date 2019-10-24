import React from 'react';
import PropTypes from 'prop-types';

import styles from './styles.css';

export const ExampleComponent = () => {
  const { text } = this.props;

  return <div className={styles.test}>Example Component: {text}</div>;
};

ExampleComponent.propTypes = {
  text: PropTypes.string
};
