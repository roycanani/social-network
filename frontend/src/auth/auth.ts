/**
 * Generated by orval v7.6.0 🍺
 * Do not edit manually.
 * Web Dev 2025 REST API
 * REST server including authentication using JWT by Roy Canani & Urir Shiber
 * OpenAPI spec version: 1.0.0
 */
import {
  useMutation
} from '@tanstack/react-query';
import type {
  MutationFunction,
  UseMutationOptions,
  UseMutationResult
} from '@tanstack/react-query';

import axios from 'axios';
import type {
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse
} from 'axios';

import type {
  AuthLogin,
  AuthRegister,
  AuthResponse,
  PostAuthLogoutBody,
  PostAuthRefreshBody
} from '.././model';





/**
 * @summary Register a new user
 */
export const postAuthRegister = (
    authRegister: AuthRegister, options?: AxiosRequestConfig
 ): Promise<AxiosResponse<void>> => {
    
    
    return axios.post(
      `/auth/register`,
      authRegister,options
    );
  }



export const getPostAuthRegisterMutationOptions = <TError = AxiosError<void>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof postAuthRegister>>, TError,{data: AuthRegister}, TContext>, axios?: AxiosRequestConfig}
): UseMutationOptions<Awaited<ReturnType<typeof postAuthRegister>>, TError,{data: AuthRegister}, TContext> => {
    
const mutationKey = ['postAuthRegister'];
const {mutation: mutationOptions, axios: axiosOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, axios: undefined};

      


      const mutationFn: MutationFunction<Awaited<ReturnType<typeof postAuthRegister>>, {data: AuthRegister}> = (props) => {
          const {data} = props ?? {};

          return  postAuthRegister(data,axiosOptions)
        }

        


  return  { mutationFn, ...mutationOptions }}

    export type PostAuthRegisterMutationResult = NonNullable<Awaited<ReturnType<typeof postAuthRegister>>>
    export type PostAuthRegisterMutationBody = AuthRegister
    export type PostAuthRegisterMutationError = AxiosError<void>

    /**
 * @summary Register a new user
 */
export const usePostAuthRegister = <TError = AxiosError<void>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof postAuthRegister>>, TError,{data: AuthRegister}, TContext>, axios?: AxiosRequestConfig}
): UseMutationResult<
        Awaited<ReturnType<typeof postAuthRegister>>,
        TError,
        {data: AuthRegister},
        TContext
      > => {

      const mutationOptions = getPostAuthRegisterMutationOptions(options);

      return useMutation(mutationOptions);
    }
    /**
 * @summary Login a user
 */
export const postAuthLogin = (
    authLogin: AuthLogin, options?: AxiosRequestConfig
 ): Promise<AxiosResponse<AuthResponse>> => {
    
    
    return axios.post(
      `/auth/login`,
      authLogin,options
    );
  }



export const getPostAuthLoginMutationOptions = <TError = AxiosError<void>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof postAuthLogin>>, TError,{data: AuthLogin}, TContext>, axios?: AxiosRequestConfig}
): UseMutationOptions<Awaited<ReturnType<typeof postAuthLogin>>, TError,{data: AuthLogin}, TContext> => {
    
const mutationKey = ['postAuthLogin'];
const {mutation: mutationOptions, axios: axiosOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, axios: undefined};

      


      const mutationFn: MutationFunction<Awaited<ReturnType<typeof postAuthLogin>>, {data: AuthLogin}> = (props) => {
          const {data} = props ?? {};

          return  postAuthLogin(data,axiosOptions)
        }

        


  return  { mutationFn, ...mutationOptions }}

    export type PostAuthLoginMutationResult = NonNullable<Awaited<ReturnType<typeof postAuthLogin>>>
    export type PostAuthLoginMutationBody = AuthLogin
    export type PostAuthLoginMutationError = AxiosError<void>

    /**
 * @summary Login a user
 */
export const usePostAuthLogin = <TError = AxiosError<void>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof postAuthLogin>>, TError,{data: AuthLogin}, TContext>, axios?: AxiosRequestConfig}
): UseMutationResult<
        Awaited<ReturnType<typeof postAuthLogin>>,
        TError,
        {data: AuthLogin},
        TContext
      > => {

      const mutationOptions = getPostAuthLoginMutationOptions(options);

      return useMutation(mutationOptions);
    }
    /**
 * @summary Refresh the access token
 */
export const postAuthRefresh = (
    postAuthRefreshBody: PostAuthRefreshBody, options?: AxiosRequestConfig
 ): Promise<AxiosResponse<AuthResponse>> => {
    
    
    return axios.post(
      `/auth/refresh`,
      postAuthRefreshBody,options
    );
  }



export const getPostAuthRefreshMutationOptions = <TError = AxiosError<void>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof postAuthRefresh>>, TError,{data: PostAuthRefreshBody}, TContext>, axios?: AxiosRequestConfig}
): UseMutationOptions<Awaited<ReturnType<typeof postAuthRefresh>>, TError,{data: PostAuthRefreshBody}, TContext> => {
    
const mutationKey = ['postAuthRefresh'];
const {mutation: mutationOptions, axios: axiosOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, axios: undefined};

      


      const mutationFn: MutationFunction<Awaited<ReturnType<typeof postAuthRefresh>>, {data: PostAuthRefreshBody}> = (props) => {
          const {data} = props ?? {};

          return  postAuthRefresh(data,axiosOptions)
        }

        


  return  { mutationFn, ...mutationOptions }}

    export type PostAuthRefreshMutationResult = NonNullable<Awaited<ReturnType<typeof postAuthRefresh>>>
    export type PostAuthRefreshMutationBody = PostAuthRefreshBody
    export type PostAuthRefreshMutationError = AxiosError<void>

    /**
 * @summary Refresh the access token
 */
export const usePostAuthRefresh = <TError = AxiosError<void>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof postAuthRefresh>>, TError,{data: PostAuthRefreshBody}, TContext>, axios?: AxiosRequestConfig}
): UseMutationResult<
        Awaited<ReturnType<typeof postAuthRefresh>>,
        TError,
        {data: PostAuthRefreshBody},
        TContext
      > => {

      const mutationOptions = getPostAuthRefreshMutationOptions(options);

      return useMutation(mutationOptions);
    }
    /**
 * @summary Logout a user
 */
export const postAuthLogout = (
    postAuthLogoutBody: PostAuthLogoutBody, options?: AxiosRequestConfig
 ): Promise<AxiosResponse<void>> => {
    
    
    return axios.post(
      `/auth/logout`,
      postAuthLogoutBody,options
    );
  }



export const getPostAuthLogoutMutationOptions = <TError = AxiosError<void>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof postAuthLogout>>, TError,{data: PostAuthLogoutBody}, TContext>, axios?: AxiosRequestConfig}
): UseMutationOptions<Awaited<ReturnType<typeof postAuthLogout>>, TError,{data: PostAuthLogoutBody}, TContext> => {
    
const mutationKey = ['postAuthLogout'];
const {mutation: mutationOptions, axios: axiosOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, axios: undefined};

      


      const mutationFn: MutationFunction<Awaited<ReturnType<typeof postAuthLogout>>, {data: PostAuthLogoutBody}> = (props) => {
          const {data} = props ?? {};

          return  postAuthLogout(data,axiosOptions)
        }

        


  return  { mutationFn, ...mutationOptions }}

    export type PostAuthLogoutMutationResult = NonNullable<Awaited<ReturnType<typeof postAuthLogout>>>
    export type PostAuthLogoutMutationBody = PostAuthLogoutBody
    export type PostAuthLogoutMutationError = AxiosError<void>

    /**
 * @summary Logout a user
 */
export const usePostAuthLogout = <TError = AxiosError<void>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof postAuthLogout>>, TError,{data: PostAuthLogoutBody}, TContext>, axios?: AxiosRequestConfig}
): UseMutationResult<
        Awaited<ReturnType<typeof postAuthLogout>>,
        TError,
        {data: PostAuthLogoutBody},
        TContext
      > => {

      const mutationOptions = getPostAuthLogoutMutationOptions(options);

      return useMutation(mutationOptions);
    }
    