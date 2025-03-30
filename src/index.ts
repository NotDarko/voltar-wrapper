import axios, { AxiosInstance, AxiosResponse } from 'axios';

interface BypassResponse {
  status: "success" | "error";
  result?: string;
  message?: string;
  cached?: boolean;
}

interface CreateTaskResponse {
  status: "success" | "error";
  taskId?: string;
  message: string;
}

interface TaskResultResponse {
  status: "success" | "processing" | "error";
  result?: string;
  message?: string;
  cached?: boolean;
}

interface ServicesResponse {
  services: Record<string, string[]>;
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

  public async createBypassTask(url: string, cache: boolean = true): Promise<CreateTaskResponse> {
    try {
      if (!url) {
        throw new Error('URL is required');
      }

      const response: AxiosResponse = await this.client.post('/bypass/createTask', { 
        url, 
        cache 
      });
      
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(`Task creation failed: ${error.response.data.message || error.message}`);
      }
      throw error;
    }
  }


  public async getTaskResult(taskId: string): Promise<TaskResultResponse> {
    try {
      if (!taskId) {
        throw new Error('Task ID is required');
      }

      const response: AxiosResponse = await this.client.get(`/bypass/getTaskResult/${taskId}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(`Failed to get task result: ${error.response.data.message || error.message}`);
      }
      throw error;
    }
  }

  public async bypassAsync(
    url: string, 
    cache: boolean = true, 
    pollingInterval: number = 1000,
    timeout: number = 120000
  ): Promise<TaskResultResponse> {
    try {
      if (!url) {
        throw new Error('URL is required');
      }

      const createTaskResult = await this.createBypassTask(url, cache);
      
      if (createTaskResult.status !== "success" || !createTaskResult.taskId) {
        throw new Error(`Failed to create task: ${createTaskResult.message}`);
      }

      const task = createTaskResult.taskId;
      let taskResult: TaskResultResponse = { status: "processing", message: "Task is starting" };
      let isComplete = false;
      
      const sTime = Date.now();
      
      while (!isComplete) {
        if (Date.now() - sTime > timeout) {
          throw new Error(`Task timed out after ${timeout}ms`);
        }
        
        taskResult = await this.getTaskResult(task);
        
        if (taskResult.status === "processing") {
          await new Promise(resolve => setTimeout(resolve, pollingInterval));
        } else {
          isComplete = true;
        }
      }
      
      return taskResult;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('An unknown error occurred during asynchronous bypass');
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