'use babel';

import React from 'react';
import { Card, CardHeader, CardActions, CardText, RaisedButton } from 'material-ui';
import jimp from 'jimp'
import { approximate } from '../helpers/approximation'
import { confidenceMap } from '../helpers/confidence'
import ImageInputCard from './ImageInputCard'

export default class ImagesInput extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      originalImage: null,
      maskImage: null,
      approxImageUrl: null,
      confidenceImageUrl: null,
    }
  }

  calculateApproxImage(){
    const { originalImage, maskImage } = this.state
    const image = approximate(originalImage, maskImage)
    image.getBase64(jimp.AUTO, (error, urlImage) => {
      this.setState({approxImageUrl: urlImage})
    })
  }

  calculateConfidenceMap(){
    const image = confidenceMap(this.state.maskImage)
    image.getBase64(jimp.AUTO, (error, urlImage) => {
      this.setState({confidenceImageUrl: urlImage})
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
              <li><a>Denyson Grellert</a></li>
            </ul>
          </div>
        </nav>
        <div className="ImagesInput">
          <ImageInputCard title="Imagem original" onChange={image => this.setState({ originalImage: image })}/>
          <ImageInputCard title="Imagem matte" onChange={image => this.setState({ maskImage: image })}/>
          <Card>
            <CardHeader title="Imagem aproximada" />
            <CardText>
              <img src={this.state.approxImageUrl} />
            </CardText>
            <CardActions>
              <RaisedButton label="Calcular aproximação" primary onClick={() => this.calculateApproxImage()} />
            </CardActions>
          </Card>
          <Card>
            <CardHeader title="Confidence map" />
            <CardText>
              <img src={this.state.confidenceImageUrl} />
            </CardText>
            <CardActions>
              <RaisedButton label="Calcular Confidence map" primary onClick={() => this.calculateConfidenceMap()} />
            </CardActions>
          </Card>
        </div>
      </div>
    )
  }
}
