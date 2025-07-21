import { getHttpClient, HTTPClient } from '@musetrip360/query-foundation';
export class UploadEndpoints {
  private static httpClient: HTTPClient;

  static getHttpClient(): HTTPClient {
    if (!this.httpClient) {
      this.httpClient = getHttpClient();
    }
    return this.httpClient;
  }

  // Define your upload endpoints here
}
