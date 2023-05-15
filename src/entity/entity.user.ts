class User {
    _id: string;
    firstname: string;
    lastname: string;
    username: string;
    email: string;
    creationDate: string;
    lastLogin: Date | null;
    isSupportTeam: boolean;
    clientId: string;
    role: string;
    language: string;
    homepagePath: string;
    token: string;
    tokenCreation: string;
    password: string;
    companyId: string;
    dateFormat: string;
    alertsOn: boolean;
  
    constructor({
      _id = '',
      firstname = '',
      lastname = '',
      username = '',
      email = '',
      creationDate = '',
      lastLogin = null,
      isSupportTeam = false,
      clientId = '',
      language = 'fr',
      homepagePath = '',
      role = 'user',
      token = '',
      tokenCreation = '',
      password = '',
      companyId = '',
      dateFormat = 'fr',
      alertsOn = false,
    }: {
      _id?: string;
      firstname?: string;
      lastname?: string;
      username?: string;
      email?: string;
      creationDate?: string;
      lastLogin?: Date | null;
      isSupportTeam?: boolean;
      clientId?: string;
      language?: string;
      homepagePath?: string;
      role?: string;
      token?: string;
      tokenCreation?: string;
      password?: string;
      companyId?: string;
      dateFormat?: string;
      alertsOn?: boolean;
    }) {
      this._id = _id.toString();
      this.firstname = firstname;
      this.lastname = lastname;
      this.username = username;
      this.email = email;
      this.creationDate = creationDate;
      this.lastLogin = lastLogin;
      this.isSupportTeam = isSupportTeam;
      this.clientId = clientId;
      this.role = role;
      this.language = language;
      this.homepagePath = homepagePath;
      this.token = token;
      this.tokenCreation = tokenCreation;
      this.password = password;
      this.companyId = companyId;
      this.dateFormat = dateFormat;
      this.alertsOn = alertsOn;
    }
  }
  
  export default User;