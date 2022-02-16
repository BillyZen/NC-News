exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else next(err)
}

exports.handlePsqlErrors = (err, req, res, next) => {
  if (err.code === '22P02') {
    res.status(400).send({ msg: 'Bad Request' });
  } else if (err.code === '23503') {
    res.status(400).send({msg: "Username does not exist, comment rejected"})
  } else next(err);
}


exports.handle500 = (err, req, res, next) => {
    console.log(err)
    res.status(500).send({ msg: "Internal Server Error" });
};
