exports.handlePsqlErrors = (err, req, res, next) => {
  if (err.code === '22P02') {
    res.status(400).send({ msg: 'Bad Request' });
  } else next(err);
}


exports.handle500 = (err, req, res, next) => {
    console.log(err)
    res.status(500).send({ msg: "Internal Server Error" });
};
