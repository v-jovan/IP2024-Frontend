// store/app.state.ts
import { ActionReducerMap } from '@ngrx/store';
import { State, tokenReducer } from './auth/auth.reducer';

export interface AppState {
  auth: State;
}

export const reducers: ActionReducerMap<AppState> = {
  auth: tokenReducer
};
