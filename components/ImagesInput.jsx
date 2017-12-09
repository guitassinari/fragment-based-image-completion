'use babel';

import React from 'react';

export default class ImagesInput extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      originalImage: null,
      maskImage: null,
    }
  }

  setOriginalImage(e){
    console.log(e.target.value)
    this.readImage(e.target).then(
      image => this.setState({ originalImage: e.value })
    )
  }

  setMaskImage(e){
    console.log(e.target.value)
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
          <div>
            <img src={this.state.originalImage} />
            <input type="file" onChange={e => this.setOriginalImage(e)} accept="image/jpeg" />
          </div>
          <div>
            <img src={this.state.maskImage} />
            <input type="file" onChange={e => this.setMaskImage(e)}  accept="image/jpeg" />
          </div>
        </div>
      </div>
    )
  }
}
