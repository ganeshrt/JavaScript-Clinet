import * as yup from 'yup';

export const validation = () => {
  console.log('validator');
  const schema = yup.object().shape({
    name: yup.string()
      .required(' Name is required !')
      .min(3),
    email: yup.string()
      .required('email is required !')
      .matches('@successive.com$'),
    pass: yup.string()
      .required('password is required !')
      .min(8),
  });


  const {
    email, name, pass,
  } = this.state;
  schema.validate({
    name, email, pass,
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
    });
    this.setState({
      hasError: true,
      error: parsedError,
    });
  });
};
