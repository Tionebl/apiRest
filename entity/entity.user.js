class User {
    constructor({
      _id = '',
      firstname = '',
      lastname = '',
      username = '',
      language = 'fr',
      homepagePath = '',
      role = 'user',
      token = '',
      tokenCreation = '',
      password = '',
      dateFormat = 'fr',
    }) {
      this._id = _id.toString();
      this.firstname = firstname;
      this.lastname = lastname;
      this.username = username;
      this.email = email;
      this.role = role;
      this.language = language;
      this.homepagePath = homepagePath;
      this.token = token;
      this.tokenCreation = tokenCreation;
      this.password = password;
      this.dateFormat = dateFormat;
    }
  }
  
  module.exports = User;
  