import React from 'react';
import style from './style';

export class SelectField extends React.Component {
  render() {
    const {
      option, value, onChange, label, error, disabled,onblur
    } = this.props;

    const demo = {
      width: '100%',
      padding: '12px 20px',
      margin: '8px 0 ',
      border: '1px solid red',
      borderRadius: '4px',
      boxSizing: 'border-box',

    };
    const mystyle = error ? demo : style.select;

    const dropDownList = option.map(item => <option style={style.select} value={item.value}>{item.label}</option>);
    return (
      <div key={value}>
        <label style={style.labelcss}>{label}</label>
        <select style={mystyle} value={value} onChange={onChange} disabled={disabled} onBlur={onblur} required>
          {dropDownList}
        </select>
        {error ? (
          <label style={style.errorCss}>
            {' '}
            {this.props.error}
            {' '}
          </label>
        ) : ''}
      </div>
    );
  }
}
