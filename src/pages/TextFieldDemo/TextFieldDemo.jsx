import React from 'react';
import { TextField } from '../../components/TextField/index';
import { Slider } from '../../components/Slider';
import { BANNERS } from '../../components/Slider/configs/constants';

class TextFieldDemo extends React.Component {
  render() {
    return (
      <>
        <div>
          <Slider banner={BANNERS} duration="2000" height="200" random={false} />
        </div>
        <TextField value="Disabled " disabled label="This is Disabled Input " />
        <TextField value="Accessible " disabled={false} label="This is Valid Input " />
        <TextField value="101" disabled={false} error label="This is Input with error " />
      </>
    );
  }
}

export { TextFieldDemo };
