export interface LoadingState {
  isLoading: boolean;
  isError: boolean;
  error: string | null;
}

export interface AsyncState<T> extends LoadingState {
  data: T | null;
}

export type LoadingStatus = 'idle' | 'loading' | 'success' | 'error';

export interface AsyncStateWithStatus<T> {
  status: LoadingStatus;
  data: T | null;
  error: string | null;
}
