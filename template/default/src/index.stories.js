import React from 'react';
import { storiesOf } from '@storybook/react';

import ExampleComponent from './index';

let stories = storiesOf('ExampleComponent', module)

stories.add('Default', () => <ExampleComponent text='From Storybook'/>)