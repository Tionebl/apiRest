exports.ONE_MONTH_SECONDS = 2629800;
exports.TWO_MONTHS_SECONDS = 5259600;
exports.ONE_DAY_SECONDS = 86400;
exports.BATTERY_HISTORY_MAX = 300;

/* HEADER */
exports.HEADER_START = 0x40; // @
exports.HEADER_GATEWAY = 0x47; // G
exports.HEADER_NODE = 0x4e; // N
exports.HEADER_GET = 0x3f; // ?
exports.HEADER_SET = 0x21; //!
exports.HEADER_CONNECT = 0x43; // C
exports.HEADER_SYSTEM = 0x23; // #
exports.HEADER_GATEWAY_VERSION2 = 0x022;

/* COMMAND */
exports.COMMAND_IP = 0x00;
exports.COMMAND_RPL = 0x01;
exports.COMMAND_BROADCAST = 0x02;
exports.COMMAND_TARGETIP = 0x03;
exports.COMMAND_VERSION = 0x04;
exports.COMMAND_IPV6 = 0x05;
exports.COMMAND_DEBUG = 0x06;
exports.COMMAND_GLOBALREPAIR = 0x07;
exports.COMMAND_NEWCONNEXION = 0x08;
exports.COMMAND_REBOOT = 0xaa;
exports.COMMAND_FACTORYRESET = 0xab;
exports.COMMAND_OTA_START = 0xac;
exports.COMMAND_OTA_PACKET = 0xad;
exports.COMMAND_OTA_END = 0xae;
exports.COMMAND_OTA_ERROR = 0xaf;
exports.COMMAND_GETMAC = 0xff;
exports.COMMAND_BATTERYSTATUS = 0xba;
exports.COMMAND_NETWORKINFO = 0xbb;

/* CONFIG SYSTEM */
exports.CONFIG_IP = 0x00; // IP STATIQUE OU DHCP
exports.CONFIG_DNS = 0x01; // DNS
exports.CONFIG_TARGETIP = 0x03; // IP ou DNS OU LE MODULE (GATEWAY OU NOEUD OU AUTRE) ENVOI SES TRAMES
exports.CONFIG_VERSION = 0x04; // VERSION AU FORMAT : MAJOR MINOR
exports.CONFIG_IPV6 = 0x05; // IPV6 STATIQUE OU DHCPV6
exports.CONFIG_DEBUG = 0x06; // PERMET DE CHOISIR L'INTERFACE DE DEBUG (voir doc gateway)
exports.CONFIG_RECONNECT = 0x07; // RECONNEXION SUITE A UNE DECONNEXION (VALABLE EN TCP UNIQUEMENT)
exports.CONFIG_FREQUENCY = 0x08; // FREQUENCE
exports.CONFIG_OTA_START = 0x09; // DEMARRAGE DE L'OTA
exports.CONFIG_OTA_PACKET = 0x0a; // DEMANDE D'UN PAQUET OTA
exports.CONFIG_OTA_END = 0x0b; // FIN DE L'OTA
exports.CONFIG_START = 0x0c; // DEMARRAGE D'UN NOEUD (format : pluginId + major + minor)

exports.GATEWAY_NETWORKFRAME = 0xff;

exports.MAC_SIZE = 8;
exports.IP_SIZE = 16;
exports.RSSI_SIZE = 1;
exports.LQI_SIZE = 1;

/* PROVIDER TYPE */
exports.PROVIDER_UDP = 0;
exports.PROVIDER_TCP = 1;

/* LOG SEVERITIES */
exports.LOG_INFO = 'info';
exports.LOG_DEBUG = 'debug';
exports.LOG_WARNING = 'warning';
exports.LOG_ERROR = 'error';
exports.LOG_SILLY = 'silly';

/* LAYERS */
exports.LAYER_DAL = 'DAL';
exports.LAYER_BUSINESS = 'BUSINESS';
exports.LAYER_PROVIDER = 'PROVIDER';
exports.LAYER_WEB = 'WEB';
exports.LAYER_PLUGIN = 'PLUGIN';

exports.FREQUENCY = 868000000;

exports.BROADCAST_IPV6 = 'ff02:0000:0000:0000:0000:0000:0000:0001';

exports.FIRMWARE_STAGES = ['Alpha', 'Beta', 'Production'];
exports.FIRMWARE_PROVIDER = ['TCP', 'UDP', 'Sigfox', 'Lora', 'NbIot'];
exports.CRC32_MPEG2_PARAMS = {
  order: 32,
  polynom: '4C11DB7',
  init: 'FFFFFFFF',
  xor: '00000000',
  reverseIn: false,
  reverseOut: false,
};

exports.MJ_APIKEY_PUBLIC = 'f0069a1073db9d7b8ed38f5be3cc9fef';
exports.MJ_APIKEY_PRIVATE = 'fd567e809117e4d42aa6ef692c1f11f3';

exports.systemUser = {
  username: 'system',
  role: 'system',
};

/**
 * LORA
 */
const MQTT_CHANNEL_DATA_FROM = 'out'; // data are published by the gateway
const MQTT_CHANNEL_DATA_TO = 'in'; // data are sending to the gateway
const MQTT_CHANNEL_API_REQUEST = 'api_request';
const MQTT_CHANNEL_API_RESPONSE = 'api_response';
const MQTT_CHANNEL_BROADCAST_REQUEST = 'broacast';
exports.Lora = {
  MQTT_CHANNEL_API_REQUEST,
  MQTT_CHANNEL_DATA_FROM,
  MQTT_CHANNEL_DATA_TO,
  MQTT_CHANNEL_API_RESPONSE,
};

/**
 * SIM
 */
exports.SIM_UPDATE_TOPIC = 'central/sim/update';

module.exports.NetworkConnectionType = [
  { id: 0, name: 'Inconnu' },
  { id: 101, name: 'Ethernet' },
  { id: 102, name: 'Wifi' },
  { id: 103, name: 'Lora' },
  { id: 104, name: 'Sigfox' },
  { id: 3, name: 'GPRS' },
  { id: 7, name: 'LTE Cat-M1' },
  { id: 8, name: 'LTE NB-IOT' },
];
