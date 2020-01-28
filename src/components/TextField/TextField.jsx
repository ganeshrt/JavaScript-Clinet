/* eslint-disable jsx-a11y/label-has-for */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import style from './style';

// eslint-disable-next-line react/prefer-stateless-function
export class TextField extends React.Component {
  render() {
    const { select, labelcss, errorCss } = style;
    const {
      value, disabled, error, label, onChange, onblur,
    } = this.props;


    const demo = {
      width: '100%',
      padding: '12px 20px',
      margin: '8px 0 ',
      border: '1px solid red',
      borderRadius: '4px',
      boxSizing: 'border-box',

    };
    const mystyle = error ? demo : select;
    return (
      <div>
        <>
          <label style={labelcss}>{label}</label>
          <input
            type="text"
            value={value}
            disabled={disabled}
            style={mystyle}
            onChange={onChange}
            onBlur={onblur}
            required
          />
          {error ? (
            <label style={errorCss}>
              {' '}
              {this.props.error}
              {' '}
            </label>
          ) : ''}

        </>
      </div>
    );
  }
}
