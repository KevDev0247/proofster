interface AxiosError extends Error {
  config: any;
  isAxiosError: boolean;
  toJSON: () => any;
}

export default AxiosError;
