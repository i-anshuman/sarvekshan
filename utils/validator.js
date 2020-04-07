const isName = (name) => {
  return /^[A-Za-z]([ ]?[A-Za-z]+)+$/.test(name);
}

const isEmail = (email) => {
  return /^\w+@\w+\.\w+$/.test(email);
}

module.exports = { isName, isEmail };
