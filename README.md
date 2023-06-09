# SMS Service
Attention, before using you need to register on the site https://smsgateway24.com/ and follow the instructions on this site.

The SMS Service package provides a convenient way to send SMS messages and perform other operations using the SMS Gateway 24 API. It utilizes the Axios library for making HTTP requests and the FormData library for handling multipart/form-data requests.

## Installation

To use this package in your project, you need to have Node.js installed. You can install the package via npm by running the following command:

```shell
npm install  sms-gateway24
```

## Usage

To use the SMS Service, follow the steps below:

1. Create an instance of the `SmsService` class by providing your email and password received after registering on the site https://smsgateway24.com/:

```javascript
const smsService = new SmsService('your-email@example.com', 'your-password');
```

2. Initialize the service by calling the `initialize` method:

```javascript
await smsService.initialize();
```

3. You can now use the SMS Service methods to send SMS messages, add contacts, get device status, and perform other operations.

### Sending an SMS

To send an SMS message, use the `sendSMS` method:

```javascript
const phoneNumbers = '1234567890';
const message = 'Hello, World!';

try {
  const smsId = await smsService.sendSMS(phoneNumbers, message);
  console.log('SMS sent successfully. SMS ID:', smsId);
} catch (error) {
  console.error('Failed to send SMS:', error.message);
}
```

### Adding a Contact with Tags

To add a contact with tags, use the `addContactWithTags` method:

```javascript
const phone = '1234567890';
const tagId = 1;
const fullName = 'John Doe';

try {
  const contactId = await smsService.addContactWithTags(phone, tagId, fullName);
  console.log('Contact added successfully. Contact ID:', contactId);
} catch (error) {
  console.error('Failed to add contact with tags:', error.message);
}
```

### Getting Device Status

To get the status of a device, use the `getDeviceStatus` method:

```javascript
const deviceId = 123;

try {
  const { lastseen, device_id, title } = await smsService.getDeviceStatus(deviceId);
  console.log('Device Status:');
  console.log('Last Seen:', lastseen);
  console.log('Device ID:', device_id);
  console.log('Title:', title);
} catch (error) {
  console.error('Failed to get device status:', error.message);
}
```

### Getting All Devices

To get information about all devices, use the `getAllDevices` method:

```javascript
try {
  const devices = await smsService.getAllDevices();
  console.log('All Devices:', devices);
} catch (error) {
  console.error('Failed to get all devices:', error.message);
}
```

### Getting SMS Status

To get the status of an SMS message, use the `getSmsStatus` method:

```javascript
const smsId = 123;

try {
  const { smsId, status, statusDescription } = await smsService.getSmsStatus(smsId);
  console.log('SMS Status:');
  console.log('SMS ID:', smsId);
  console.log('Status:', status);
  console.log('Status Description:', statusDescription);
} catch (error) {
  console.error('Failed to get SMS status:', error.message);
}
```

These are just a few examples of how to use the SMS Service package. You can explore the available methods in the source code and refer to the SMS Gateway 24 API documentation for more information on the available endpoints and parameters.

## License



This project is licensed under the [MIT License](LICENSE).

## FQA

For all questions, bugs and suggestions, please contact david.perov60@gmail.com