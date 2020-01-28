import React from 'react';
import * as yup from 'yup';
import { TextField } from '../../components/TextField/index';
import { SelectField } from '../../components/SelectField';
import {
  SPORTS, CRICKET_PLAYERS, FOOTBALL_PLAYERS,
} from '../../components/Slider/configs/constants';
import { RadioGroup } from '../../components/RadioGroup';
import { Button } from '../../components/Button';

class InputDemo extends React.Component {
  state ={
    name: '',
    sports: '',
    error: {},
    touch: {},
    who: '',
    hasError: true,

  }

  container ={
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-end',
    float: 'right',
  }


  inputHandler = (event) => {
    this.setState(
      { name: event.target.value }, this.validation,
    );
  }

  selectHandler = (event) => {
    const { touch } = this.state;
    touch.sports = true;
    this.setState(
      { sports: event.target.value, touch }, this.validation,
    );
  }


  getErrors = (value) => {
    const { error } = this.state;
    if (this.isTouched(value) && this.hasErrors(value)) {
      return error[value];
    }

    return false;
  }


  hasErrors(value) {
    const { error } = this.state;
    return error[value];
  }

  isTouched(value) {
    const { touch } = this.state;
    if (touch[value]) {
      return true;
    }
    return false;
  }


  handleBlur =field => () => {
    const { touch } = this.state;
    touch[field] = true;
    console.log('on blur', field, touch);
    this.setState({
      touch,
    }, this.validation);
  }


  validation() {
    const schema = yup.object().shape({
      name: yup.string()
        .required(' Name is required !')
        .min(3),
      sports: yup.string()
        .required('Sport is required !'),
      who: yup.string()
        .required('please select player type !'),
    });

    const {
      name, sports, who,
    } = this.state;
    schema.validate({
      name, sports, who,
    }, { abortEarly: false }).then((res) => {
      if (res) {
        this.setState({
          hasError: false,
          error: {},
        });
      }
    }).catch((err) => {
      console.log(err);
      const parsedError = [];
      err.inner.map((item) => {
        if (!parsedError[item.path]) {
          parsedError[item.path] = item.message;
        }
        return null;
      });
      this.setState({
        hasError: true,
        error: parsedError,
      });
    });
  }

  radioHandler=(event) => {
    const { touch } = this.state;
    touch.who = true;
    this.setState(
      { who: event.target.value, touch }, this.validation,
    );
  }


  renderSport() {
    const { sports } = this.state;
    if (sports === 'cricket') {
      return <RadioGroup option={CRICKET_PLAYERS} value={sports} label="What you do?" onChange={this.radioHandler} error={this.getErrors('who')} />;
    }
    if (sports === 'football') {
      return <RadioGroup option={FOOTBALL_PLAYERS} label="What you do?" onChange={this.radioHandler} error={this.getErrors('who')} />;
    }
    return null;
  }


  render() {
    const {
      name, sports,
    } = this.state;
    console.log(this.state);
    return (
      <div>
        <form>
          <TextField value={name} disabled={false} label="Name : " onChange={this.inputHandler} error={this.getErrors('name')} onblur={this.handleBlur('name')} />
          <SelectField value={sports} onChange={this.selectHandler} option={SPORTS} label="Select the game you play?" error={this.getErrors('sports')} onblur={this.handleBlur('sports')} />
          {this.renderSport()}
          <div style={this.container}>
            <Button value="Cancel" disabled={false} />
            <Button value="Submit" disabled={this.state.hasError} />

          </div>
        </form>
      </div>
    );
  }
}

export { InputDemo };
