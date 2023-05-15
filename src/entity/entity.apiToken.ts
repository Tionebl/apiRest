import moment from 'moment';

class ApiKey {
  _id: string;
  name: string;
  token: string;
  creationTimeStamp: moment.Moment;
  clientId: string | null;
  companyId: string | null;
  lastUsage: moment.Moment | null;

  constructor({
    _id = '',
    name = '',
    token = '',
    creationTimeStamp = moment().utc(),
    clientId = null,
    companyId = null,
    lastUsage = null,
  }: {
    _id?: string;
    name?: string;
    token?: string;
    creationTimeStamp?: moment.Moment;
    clientId?: string | null;
    companyId?: string | null;
    lastUsage?: moment.Moment | null;
  }) {
    this._id = _id.toString();
    this.name = name;
    this.token = token;
    this.creationTimeStamp = creationTimeStamp;
    this.clientId = clientId;
    this.companyId = companyId;
    this.lastUsage = lastUsage;
  }
}

export default ApiKey;