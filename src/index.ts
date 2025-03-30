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
  services: { adlinks: string[]; keysystems: string[] };
}

interface RequestOptions {
  method: string;
  headers: Record<string, string>;
  body?: string;
}

export class Voltar {
  private baseURL: string = 'https://api.voltar.lol';
  private headers: Record<string, string>;

  constructor(private apiKey: string) {
    if (!apiKey) {
      throw new Error('API key is required');
    }

    this.headers = {
      'Content-Type': 'application/json',
      'x-api-key': this.apiKey
    };
  }

  private async request<T>(endpoint: string, method: string, body?: any): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const options: RequestOptions = {
      method,
      headers: this.headers
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    try {
      const response = await fetch(url, options);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Request failed with status ${response.status}`);
      }
      
      return await response.json() as T;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('An unknown error occurred');
    }
  }

  public async bypass(url: string, cache: boolean = true): Promise<BypassResponse> {
    if (!url) {
      throw new Error('URL is required');
    }

    try {
      return await this.request<BypassResponse>('/bypass', 'POST', { url, cache });
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Bypass failed: ${error.message}`);
      }
      throw error;
    }
  }

  public async createTask(url: string, cache: boolean = true): Promise<CreateTaskResponse> {
    if (!url) {
      throw new Error('URL is required');
    }

    try {
      return await this.request<CreateTaskResponse>('/bypass/createTask', 'POST', { url, cache });
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Task creation failed: ${error.message}`);
      }
      throw error;
    }
  }

  public async getTaskResult(taskId: string): Promise<TaskResultResponse> {
    if (!taskId) {
      throw new Error('Task ID is required');
    }

    try {
      return await this.request<TaskResultResponse>(`/bypass/getTaskResult/${taskId}`, 'GET');
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to get task result: ${error.message}`);
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
    if (!url) {
      throw new Error('URL is required');
    }

    try {
      const createTaskResult = await this.createTask(url, cache);
      
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
      return await this.request<ServicesResponse>('/bypass/services', 'GET');
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to get services: ${error.message}`);
      }
      throw error;
    }
  }

}

export default Voltar;