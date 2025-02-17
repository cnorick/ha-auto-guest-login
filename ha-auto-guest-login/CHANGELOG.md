# Changelog

## 1.5.0
### Added
- Redirect to a different dashboard by providing a `d=<dashboard>` query parameter in the link

## 1.4.1
### Fixed
- switch to reading config with fs to avoid problems with importing in new node versions

## 1.4.0
### Added
- Add advanced configuration parameters
    - they allow you to specify internal and redirect URLs explicitly
    - we no longer have to always relay on where the request was made from

## 1.3.2
### Fixed
- Fix issue where login flow doesn't work if your home assisant instance uses default ports (80, 443)

## 1.3.0

### Added
- Add Admin page including:
    - the url to the auto guest login page
    - a qr that points to the page

## 1.2.0

### Added
- Fires an event so that automations can respond to guest login

### Changed
- Made some configuration parameters optional

## 1.1.0

### Added
- Add customization configuration parameters: welcom_screen_delay_ms, welcome_screen_main_text, and welcome_screen_secondary_text

## 1.0.1

### Fixed
- Fix formatting in docs

### Changed
- Refactor server file

## 1.0.0

### Changed

- Turn ha-auto-guest-login into a Home Assistant Addon
