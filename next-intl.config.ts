import {getRequestConfig} from 'next-intl/server';

export default getRequestConfig(() => ({
  // lista dei locale supportati
  locales: ['en', 'it'],
  // locale di default (deve essere nella lista)
  defaultLocale: 'en'
}));