// EPOCH_OFFSET is the seconds difference between standard epoch time (1970 based used in this app)
// and the epoch time on the esp32 (2000 based)
export const environment = {
  production: false,
  netProbeHost: '192.168.1.46',
  EPOCH_OFFSET: 946684800,
};
