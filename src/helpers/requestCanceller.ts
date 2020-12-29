import axios, { AxiosPromise, AxiosRequestConfig, CancelTokenSource, Method } from 'axios';

const requests: {
    [key: string]: CancelTokenSource
} = {}

export default function cancellableRequest(
    requestUuid: string,
    method: Method,
    url: string,
    config: AxiosRequestConfig
): AxiosPromise {
    if (requests[requestUuid]) {
        requests[requestUuid].cancel();
    }

    requests[requestUuid] = axios.CancelToken.source();

    return axios({
        ...config,
        method,
        url,
        cancelToken: requests[requestUuid].token,
    });
}
