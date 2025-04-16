import { AxiosResponse } from 'axios';

export interface AxiosResponseWithRequest extends AxiosResponse {
  request?: {
    res?: {
      responseUrl?: string;
    };
  };
}

export interface AxiosResponseWithRedirect extends AxiosResponse {
  request?: any;
}
