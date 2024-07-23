import { createReducer, on } from '@ngrx/store';
import * as TokenActions from './auth.actions';

export interface State {
  token: string | null;
}

export const initialState: State = {
  token: null
};

export const tokenReducer = createReducer(
  initialState,
  on(TokenActions.setToken, (state, { token }) => ({ ...state, token })),
  on(TokenActions.clearToken, (state) => ({ ...state, token: null }))
);
