import axios, { AxiosInstance, AxiosResponse } from 'axios';

interface BypassResponse {
  status: string;
  result: string;
  cached: boolean;
}

interface ServicesResponse {
  adlinks: string[];
  keysystems: string[];
}


export class Voltar {
  private client: AxiosInstance;
  private baseURL: string = 'https://api.voltar.lol';


  constructor(private apiKey: string) {
    if (!apiKey) {
      throw new Error('API key is required');
    }

    this.client = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.apiKey
      }
    });
  }


  public async bypass(url: string, cache: boolean = true): Promise<BypassResponse> {
    try {
      if (!url) {
        throw new Error('URL is required');
      }

      const response: AxiosResponse = await this.client.post('/bypass', { 
        url, 
        cache 
      });
      
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(`Bypass failed: ${error.response.data.message || error.message}`);
      }
      throw error;
    }
  }

  public async services(): Promise<ServicesResponse> {
    try {
      const response: AxiosResponse = await this.client.get('/bypass/services');
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(`Failed to get services: ${error.response.data.message || error.message}`);
      }
      throw error;
    }
  }

}

export default Voltar;