import axios, { AxiosResponse } from 'axios';
import FormData from 'form-data';

export class SmsService {
  private token: string | null;
  private email: string;
  private password: string;
  private api = 'https://smsgateway24.com/getdata';

  constructor(email: string, password: string) {
    this.email = email;
    this.password = password;
    this.token = null;
  }

  private async postRequest(url: string, data: any, headers: any = {}): Promise<any> {
    try {
      const response: AxiosResponse = await axios.post(`${this.api}${url}`, data, headers);
      return response.data;
    } catch (error: any) {
			console.error(error.message);
      throw new Error(`Error during HTTP POST request: ${error.message}`);
    }
  }

  async initialize(): Promise<void> {
    try {
      const params = new URLSearchParams();
      params.append('email', this.email);
      params.append('pass', this.password);

      const response = await this.postRequest('/gettoken', params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      if (response.error === 0) {
        this.token = response.token;
      } else {
        throw new Error(`Error initializing SmsService: ${response.message}`);
      }
    } catch (error: any) {
      throw new Error(`Error initializing SmsService: ${error.message}`);
    }
  }

  async sendSMS(
    phoneNumbers: string,
    message: string,
    deviceId: number = 10924,
    timeToSend: string | null = null,
    sim: string | null = null,
    customerId: string | null = null,
    urgent: number = 1
  ): Promise<number | false> {
    try {
      const form = new FormData();
      form.append('token', this.token as string);
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

      const response = await this.postRequest('/addsms', form, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

			return response.sms_id;
    } catch (error: any) {
			console.error(error.message);
      throw new Error(`Error sending SMS: ${error.message}`);
    }
  }

  async addContactWithTags(phone: string, tag_id: number, fullName: string): Promise<number | false> {
    try {
      const params = new URLSearchParams();
      params.append('token', this.token as string);
      params.append('fullname', fullName);
      params.append('phone', phone);
      params.append('tag_id', tag_id.toString());

      const response = await this.postRequest('/savecontact', params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      return response.contact_id;
    } catch (error: any) {
			console.error(error.message);
      throw new Error(`Error adding contact with tags: ${error.message}`);
    }
  }

  async getDeviceStatus(deviceId: number): Promise<{
		lastseen: string,
		device_id: number, 
		title: string
	}> {
    try {
      const response: any = await axios.get(`${this.api}/getdevicestatus`, {
				params: {
					token: this.token,
					device_id: deviceId,
				}
			});

			const { lastseen, device_id, title } = response.data;
			
			return { lastseen, device_id, title };
    } catch (error: any) {
			console.error(error.message);
      throw new Error(`Error during HTTP GET request: ${error.message}`);
    }
  }

  async getAllDevices(): Promise<any> {
    try {
      const response: any = await axios.get(`${this.api}/getalldevices`, {
				params: {
					token: this.token,
				}
      });

			return response.data;
    } catch (error: any) {
			console.error(error.message);
      return [];
    }
  }

  async getSmsStatus(smsId: any): Promise<{
		smsId: number,
		status: number,
		statusDescription: string
	}> {
    try {
      const response = await axios.get(`${this.api}/getsmsstatus`, {
				params: {
					token: this.token,
					sms_id: smsId,
				}
      });

      const { sms_id, status, status_description } = response.data;

      return { smsId: sms_id, status, statusDescription: status_description };
    } catch (error: any) {
			console.error(error.message);
      throw new Error('Failed to get SMS status');
    }
  }

  async addTag(title: string): Promise<number> {
    try {

			const params = new URLSearchParams();
      params.append('token', this.token as string);
      params.append('title', title);

      const response = await axios.post(`${this.api}/savetag`, params, {
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				}
			});

      const { tag_id } = response.data;

      return tag_id;
    } catch (error: any) {
			console.error(error.message);
      throw new Error('Failed to add tag');
    }
  }

  async getSMSByCriteria(criteria: {
    device_id?: number;
    status?: number;
    begindate?: string;
    enddate?: string;
    sim?: number;
    customerid?: number;
    onlycount?: number;
    phone?: string;
    orderbydesc?: number;
    timezone?: string;
  }): Promise<any> {
    try {
      const response = await axios.get(`${this.api}/getallsms`, {
        params: {
          token: this.token,
          ...criteria,
        },
      });

      const { sms } = response.data;

      return sms;
    } catch (error: any) {
			console.error(error.message);
      throw new Error('Failed to get SMS by criteria');
    }
  }

  async sendBulkSMS(data: { token: string; smsdata: any[] }): Promise<boolean> {
    try {
      await this.postRequest('/addalotofsms', data);

			return true;
    } catch (error: any) {
			console.error(error.message);
      throw new Error('Failed to send bulk SMS');
    }
  }

	async createBroadcast(title: string, deviceId: number, message: string, tags: string, sim: number = 0): Promise<number> {
		try {
			const params = new URLSearchParams();
			params.append('token', this.token as string);
			params.append('title', title);
			params.append('device_id', deviceId.toString());
			params.append('body', message);
			params.append('tags', tags);
			params.append('sim', sim.toString());
	
			const response = await this.postRequest('/savepaket', params, {
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				}
			});
	
			return response.paket;
		} catch (error: any) {
			console.error(error.message);
			throw new Error(`Error creating broadcast: ${error.message}`);
		}
	}
}