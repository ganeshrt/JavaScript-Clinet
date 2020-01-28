import React from 'react';
import { getRandomNumber, getNextRoundRobin } from '../../lib/utils/math';
// import { BANNERS, DEFAULT_BANNER_IMAGE } from './configs/constants';
import style from './style';
import { PUBLIC_IMAGE_FOLDER, DEFAULT_BANNER_IMAGE } from './configs/constants';

export class Slider extends React.Component {
  timeId=0;

  state = {
    index: 0,
  };

  componentDidMount() {
    const { duration } = this.props;
    this.timeId = setInterval(() => this.imageChanger(), duration);
  }

  componentWillUnmount() {
    clearInterval(this.timeId);
  }

  imageChanger() {
    const { random, banner } = this.props;
    const { index } = this.state;
    const newIndex = random ? getRandomNumber(banner.length) : getNextRoundRobin(index, banner.length);
    this.setState(
      { index: newIndex },
    );
  }

  render() {
    const {
      banner, height, alt,
    } = this.props;
    const { index } = this.state;
    const image = PUBLIC_IMAGE_FOLDER + banner[index] || PUBLIC_IMAGE_FOLDER + DEFAULT_BANNER_IMAGE;
    return (
      <>
        <div style={style.slider}>
          <center>
            <img src={image} alt={alt} height={height} />
          </center>
        </div>
      </>
    );
  }
}
