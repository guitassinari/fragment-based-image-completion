'use babel';

import React from 'react';
import ImagesInput from './ImagesInput'
import { MuiThemeProvider } from 'material-ui'

export default class Main extends React.Component {
  render() {
    return(
      <MuiThemeProvider>
        <ImagesInput />
      </MuiThemeProvider>
    )
  }
}
