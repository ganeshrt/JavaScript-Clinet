import React from 'react';
import style from './style';

export class Button extends React.Component {
  btnDisabled={
    border: 'none',
    color: 'black',
    padding: '15px 32px',
    textAlign: 'center',

    textDecoration: 'none',
    display: 'inline-block',
    fontSize: '16px',
    margin: '4px 2px',
    opacity: '0.6',
    cursor: 'not-allowed',

  }

  state={
    disable: this.props.disabled,
  }

  render() {
    const {
      value, disabled,
    } = this.props;
    const { btn , btnSubmit } = style;
    const mystyle = disabled ? this.btnDisabled : (value === 'Submit' ? btnSubmit:btn);
    // console.log(mystyle);
    return (
      <input type="button" style={mystyle} value={value} />

    );
  }
}
