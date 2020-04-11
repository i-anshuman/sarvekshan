const isName = (name) => {
  return /^[A-Za-z]([ ]?[A-Za-z]+)+$/.test(name);
}

const isEmail = (email) => {
  return /^\w+@\w+\.\w+$/.test(email);
}

const isTitle = (title) => {
  return /^[A-Za-z0-9 .:',-]+$/.test(title);
}

const isDescription = (description) => {
  return isTitle(description);
}

const isDate = (date) => {
  return /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/.test(date);
}

const isTime = (time) => {
  return /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/.test(time);
}

const isObjectID = (id) => {
  return /^[0-9a-f]{24}$/i.test(id);
}

module.exports = { isName, isEmail, isDate, isTime, isDescription, isTitle, isObjectID };
