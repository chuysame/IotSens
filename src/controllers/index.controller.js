const indexCtrl = {};

indexCtrl.renderIndex = (req, res) => {
  res.render('index2');
};

indexCtrl.renderAbout = (req, res) => {
  res.render('about');
};

module.exports = indexCtrl;
