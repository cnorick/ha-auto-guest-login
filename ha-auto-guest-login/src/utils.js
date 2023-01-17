export class Utils {
  constructor(addonPort) {
    this.addonPort = addonPort;
  }

  getGuestLoginUrl(req) {
    return `${req.protocol}://${req.hostname}:${this.addonPort}`;
  }
}