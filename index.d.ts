declare module '@elastic.io/ntlm-client' {
  export * from 'ntlm-client';

  import { RequestAPI, Request, CoreOptions, RequiredUriUrl } from 'request';

  export interface RequestOptions {
    username: string;
    password: string;

    uri: string;

    method: 'GET' | 'POST';

    request: {
      json: boolean; // Example of parameter passed to request.js
      body: { [key: string]: string | number | boolean };
      headers: { [key: string]: string };
    };
  }

  export function request(options: RequestOptions): Promise<Request>;
}
