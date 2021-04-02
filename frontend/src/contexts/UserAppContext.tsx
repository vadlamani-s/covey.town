import React from 'react';
import { UserAppState } from '../CoveyTypes';

/**
 * Hint: You will never need to use this directly. Instead, use the
 * `useUserAppState` hook.
 */
const Context = React.createContext<UserAppState | null>(null);

export default Context;