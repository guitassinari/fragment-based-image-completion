'use babel';

import React from 'react';
import { Card, CardHeader, CardActions, CardText, RaisedButton } from 'material-ui';
import jimp from 'jimp'
import {
  urlToJimp
} from '../helpers/buffers'

export default class ImageInputCard extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      image: null,
    }
  }

  readImage(input){
    return new Promise((resolve, reject) => {
      if (input.files && input.files[0]) {
        let reader = new FileReader()
        reader.onload = e => resolve(e.target.result)
        reader.readAsDataURL(input.files[0]);
      }
    })
  }

  setImage(e){
    this.readImage(e.target).then(
      image => {
        this.setState({ image })
        urlToJimp(image).then(jimpImage => {
          this.props.onChange(jimpImage)
        })
      }
    )
  }

  render() {
    return (
      <Card>
        <CardHeader title={this.props.title} />
        <CardText>
          <img src={this.state.image} />
        </CardText>
        <CardActions>
          <RaisedButton label="Escolher imagem" primary onClick={() => this.refs.input.click()} />
          <input type="file" onChange={e => this.setImage(e)}  accept="image/jpeg, image/x-png" ref="input" style={{display: "none"}}/>
        </CardActions>
      </Card>
    )
  }
}
