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

interface ApiResponse {
	message?: string;
	[key: string]: unknown;
}

export class Voltar {
	private readonly baseURL = "https://api.voltar.lol";
	private readonly headers: Record<string, string>;

	constructor(private apiKey: string) {
		if (!apiKey) {
			throw new Error("API key is required");
		}

		this.headers = {
			"Content-Type": "application/json",
			"x-api-key": this.apiKey,
		};
	}

	private async request<T>(
		endpoint: string,
		method: string,
		body?: Record<string, unknown>,
	): Promise<T> {
		const url = `${this.baseURL}${endpoint}`;
		const options: RequestOptions = { method, headers: this.headers };

		if (body) {
			options.body = JSON.stringify(body);
		}

		try {
			const response = await fetch(url, options);
			const contentType = response.headers.get("content-type");
			const isJson = contentType?.includes("application/json");
			const responseData = isJson
				? ((await response.json()) as ApiResponse)
				: null;

			if (!response.ok) {
				throw new Error(
					responseData?.message ||
						`Request failed with status ${response.status}`,
				);
			}

			return responseData as T;
		} catch (error) {
			throw new Error(
				error instanceof Error ? error.message : "An unexpected error occurred",
			);
		}
	}

	public bypass(url: string, cache = true) {
		if (!url) throw new Error("URL is required");
		return this.request<BypassResponse>("/bypass", "POST", { url, cache });
	}

	public createTask(url: string, cache = true) {
		if (!url) throw new Error("URL is required");
		return this.request<CreateTaskResponse>("/bypass/createTask", "POST", {
			url,
			cache,
		});
	}

	public getTaskResult(taskId: string): Promise<TaskResultResponse> {
		if (!taskId) throw new Error("Task ID is required");
		return this.request<TaskResultResponse>(
			`/bypass/getTaskResult/${taskId}`,
			"GET",
		);
	}

	private async pollTask(
		taskId: string,
		pollingInterval: number,
		timeout: number,
	): Promise<TaskResultResponse> {
		const startTime = Date.now();

		while (true) {
			if (Date.now() - startTime > timeout) {
				throw new Error(`Task timed out after ${timeout}ms`);
			}

			const taskResult = await this.getTaskResult(taskId);

			if (taskResult.status !== "processing") {
				return taskResult;
			}

			await new Promise((resolve) => setTimeout(resolve, pollingInterval));
		}
	}

	public async bypassAsync(
		url: string,
		cache = true,
		pollingInterval = 1000,
		timeout = 120000,
	) {
		if (!url) throw new Error("URL is required");

		const createTaskResult = await this.createTask(url, cache);

		if (createTaskResult.status !== "success" || !createTaskResult.taskId) {
			throw new Error(`Failed to create task: ${createTaskResult.message}`);
		}

		return this.pollTask(createTaskResult.taskId, pollingInterval, timeout);
	}

	public services() {
		return this.request<ServicesResponse>("/bypass/services", "GET");
	}
}

export default Voltar;
