import { createStore } from '@tanstack/store'
import type  { UserResponse } from "../types/user";
import { toastManager } from "../utils/toast";

export const userStore = createStore<{ user: UserResponse | null }>({
  user: null,
})

userStore.setState((state) => ({
  ...state, 
    user: getUserFromLocalStorage(),
})) 

export function getUserFromLocalStorage() {
  const userData = localStorage.getItem('user');
    if (userData) {
        try {
            return JSON.parse(userData);
        } catch (error) {
            toastManager.error('Error parsing user data from localStorage :' + (error instanceof Error ? error.message : String(error)));
            return null;
        }           
    }
    return null;
}

export function saveUserToLocalStorage(user: UserResponse) {
  try {
    localStorage.setItem('user', JSON.stringify(user));
    userStore.setState((state) => ({ ...state, user }));
  } catch (error) {
    toastManager.error('Error saving user data to localStorage :' + (error instanceof Error ? error.message : String(error)));
  }
}

export function clearUserFromLocalStorage() {
  try {
    localStorage.removeItem('user');
    userStore.setState((state) => ({ ...state, user: null }));
  } catch (error) {
    toastManager.error('Error clearing user data from localStorage :' + (error instanceof Error ? error.message : String(error)));
  }
} 