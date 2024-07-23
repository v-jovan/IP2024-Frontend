import { createFeatureSelector, createSelector } from '@ngrx/store';
import { State } from './auth.reducer';

export const selectTokenState = createFeatureSelector<State>('auth');

export const selectToken = createSelector(
  selectTokenState,
  (state: State) => state.token
);
