import React from 'react';

export class Math extends React.Component {
  calculation(first, second, operator) {
    console.log(first);
    let result;
    switch (operator) {
    case '+':
      result = first + second;
      break;
    case '-':
      result = first - second;
      break;
    case '*':
      result = first * second;
      break;
    case '/':
      if (second === 0) {
        result = 'Infinity';
      } else {
        result = first / second;
      }
      break;
    default:
      return 'Invalid Operation';
    }
    return result;
  }

  render() {
    console.log(this.props);
    const {
      first, second, operator, children,
    } = this.props;
    const result = this.calculation(first, second, operator);
    console.log(result);
    return (
      <>
        <React.Fragment>
          { React.cloneElement(children, {
            first, second, operator, result,
          })}

        </React.Fragment>
      </>
    );
  }
}
