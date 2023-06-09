"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SmsService = void 0;
const axios_1 = __importDefault(require("axios"));
const form_data_1 = __importDefault(require("form-data"));
class SmsService {
    constructor(email, password) {
        this.api = 'https://smsgateway24.com/getdata';
        this.email = email;
        this.password = password;
        this.token = null;
    }
    postRequest(url, data, headers = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield axios_1.default.post(`${this.api}${url}`, data, headers);
                return response.data;
            }
            catch (error) {
                console.error(error.message);
                throw new Error(`Error during HTTP POST request: ${error.message}`);
            }
        });
    }
    initialize() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const params = new URLSearchParams();
                params.append('email', this.email);
                params.append('pass', this.password);
                const response = yield this.postRequest('/gettoken', params, {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                });
                if (response.error === 0) {
                    this.token = response.token;
                }
                else {
                    throw new Error(`Error initializing SmsService: ${response.message}`);
                }
            }
            catch (error) {
                throw new Error(`Error initializing SmsService: ${error.message}`);
            }
        });
    }
    sendSMS(phoneNumbers, message, deviceId = 10924, timeToSend = null, sim = null, customerId = null, urgent = 1) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const form = new form_data_1.default();
                form.append('token', this.token);
                form.append('sendto', phoneNumbers);
                form.append('body', message);
                form.append('device_id', deviceId.toString());
                form.append('urgent', urgent.toString());
                // Optional parameters
                if (timeToSend) {
                    form.append('timetosend', timeToSend);
                }
                if (sim) {
                    form.append('sim', sim);
                }
                if (customerId) {
                    form.append('customerid', customerId);
                }
                const response = yield this.postRequest('/addsms', form, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                return response.sms_id;
            }
            catch (error) {
                console.error(error.message);
                throw new Error(`Error sending SMS: ${error.message}`);
            }
        });
    }
    addContactWithTags(phone, tag_id, fullName) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const params = new URLSearchParams();
                params.append('token', this.token);
                params.append('fullname', fullName);
                params.append('phone', phone);
                params.append('tag_id', tag_id.toString());
                const response = yield this.postRequest('/savecontact', params, {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                });
                return response.contact_id;
            }
            catch (error) {
                console.error(error.message);
                throw new Error(`Error adding contact with tags: ${error.message}`);
            }
        });
    }
    getDeviceStatus(deviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield axios_1.default.get(`${this.api}/getdevicestatus`, {
                    params: {
                        token: this.token,
                        device_id: deviceId,
                    }
                });
                const { lastseen, device_id, title } = response.data;
                return { lastseen, device_id, title };
            }
            catch (error) {
                console.error(error.message);
                throw new Error(`Error during HTTP GET request: ${error.message}`);
            }
        });
    }
    getAllDevices() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield axios_1.default.get(`${this.api}/getalldevices`, {
                    params: {
                        token: this.token,
                    }
                });
                return response.data;
            }
            catch (error) {
                console.error(error.message);
                return [];
            }
        });
    }
    getSmsStatus(smsId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield axios_1.default.get(`${this.api}/getsmsstatus`, {
                    params: {
                        token: this.token,
                        sms_id: smsId,
                    }
                });
                const { sms_id, status, status_description } = response.data;
                return { smsId: sms_id, status, statusDescription: status_description };
            }
            catch (error) {
                console.error(error.message);
                throw new Error('Failed to get SMS status');
            }
        });
    }
    addTag(title) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const params = new URLSearchParams();
                params.append('token', this.token);
                params.append('title', title);
                const response = yield axios_1.default.post(`${this.api}/savetag`, params, {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                });
                const { tag_id } = response.data;
                return tag_id;
            }
            catch (error) {
                console.error(error.message);
                throw new Error('Failed to add tag');
            }
        });
    }
    getSMSByCriteria(criteria) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield axios_1.default.get(`${this.api}/getallsms`, {
                    params: Object.assign({ token: this.token }, criteria),
                });
                const { sms } = response.data;
                return sms;
            }
            catch (error) {
                console.error(error.message);
                throw new Error('Failed to get SMS by criteria');
            }
        });
    }
    sendBulkSMS(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.postRequest('/addalotofsms', data);
                return true;
            }
            catch (error) {
                console.error(error.message);
                throw new Error('Failed to send bulk SMS');
            }
        });
    }
    createBroadcast(title, deviceId, message, tags, sim = 0) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const params = new URLSearchParams();
                params.append('token', this.token);
                params.append('title', title);
                params.append('device_id', deviceId.toString());
                params.append('body', message);
                params.append('tags', tags);
                params.append('sim', sim.toString());
                const response = yield this.postRequest('/savepaket', params, {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                });
                return response.paket;
            }
            catch (error) {
                console.error(error.message);
                throw new Error(`Error creating broadcast: ${error.message}`);
            }
        });
    }
}
exports.SmsService = SmsService;
