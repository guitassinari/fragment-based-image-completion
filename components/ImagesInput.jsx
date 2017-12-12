'use babel';

import React from 'react';
import { Card, CardHeader, CardActions, CardText, RaisedButton } from 'material-ui';
import jimp from 'jimp'
import {
  removeBase64Prefix
} from '../helpers/buffers'

export default class ImagesInput extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      originalImage: null,
      maskImage: null,
      approxImage: null,
    }
  }

  setOriginalImage(e){
    this.readImage(e.target).then(
      image => this.setState({ originalImage: image })
    )
  }

  setMaskImage(e){
    this.readImage(e.target).then(
      image => this.setState({ maskImage: image })
    )
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

  calculateApproxImage(){
    const { originalImage, maskImage } = this.state
    // if(!originalImage || !maskImage){
    //   return
    // }
    const buffer = Buffer.from(removeBase64Prefix(originalImage), 'base64')
    console.log(buffer)
    const readOriginalImage = jimp.read(buffer)
      .then(image => {
        this.setState({approxImage: image})
      }).catch(error => {
        console.log(error)
      })

  }

  render() {
    return (
      <div>
        <nav className="blue darken-3">
          <div className="nav-wrapper">
            <a href="#" className="brand-logo">Fragment Based Image Completion</a>
            <ul id="nav-mobile" className="right hide-on-med-and-down">
              <li><a>Guilherme Tassinari</a></li>
              <li><a>Denysom</a></li>
            </ul>
          </div>
        </nav>
        <div className="ImagesInput">
          <Card>
            <CardHeader title="Imagem original" />
            <CardText>
              <img src={this.state.originalImage} />
            </CardText>
            <CardActions>
              <RaisedButton label="Escolher imagem" primary onClick={() => this.refs.originalImageInput.click()} />
              <input type="file" onChange={e => this.setOriginalImage(e)} accept="image/jpeg" ref="originalImageInput" style={{display: "none"}} />
            </CardActions>
          </Card>
          <Card>
            <CardHeader title="Imagem matte" />
            <CardText>
              <img src={this.state.maskImage} />
            </CardText>
            <CardActions>
              <RaisedButton label="Escolher imagem" primary onClick={() => this.refs.maskImageInput.click()} />
              <input type="file" onChange={e => this.setMaskImage(e)}  accept="image/jpeg" ref="maskImageInput" style={{display: "none"}}/>
            </CardActions>
          </Card>
        </div>
        <Card>
          <CardHeader title="Imagem aproximada" />
          <CardText>
            <img src={this.state.approxImage} />
          </CardText>
          <CardActions>
            <RaisedButton label="Calcular aproximação" primary onClick={() => this.calculateApproxImage()} />
          </CardActions>
        </Card>
      </div>
    )
  }
}
