import React from 'react';
import style from './style';

export class RadioGroup extends React.Component {
  render() {
    const { option, onChange } = this.props;
    const inputRadio = option.map(item => (
      <div key={item.value}>
        <label>
          <input type="radio" name="player" value={item.value} onChange={onChange} required />
          {item.label}
        </label>
      </div>
    ));
    const { label } = this.props;
    return (
      <form>
        <div className="radio">
          <label style={style.labelcss}>
            {label}
          </label>
          {inputRadio}
        </div>
      </form>
    );
  }
}
