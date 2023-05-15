module.exports = class characters {
    constructor({ _id = '', name = '', type = '', spec='' }) {
      this._id = _id.toString();
      this.name = name;
      this.spec = spec;
      this.type = type;
    }
  };
  