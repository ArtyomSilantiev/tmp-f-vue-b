import axios, { AxiosResponse } from 'axios';
import Form from '../lib/form';

export enum NewsStatus {
  Draft = 'draft',
  Publish = 'publish'
}

export interface INewsDataItem {
  type: 'html' | 'image';
  value: string;
}

export interface INewsFetchParams {
  page?: string | number;
  pageSize?: string | number;
  sortBy?: string | null;
  sortDesc?: string | null;
}

export interface INewsPutParams {
  id?: string | null;
  status: NewsStatus;
  header: string;
  annotation: string;
  content: string;
  publishAt: Date;
}

export interface INewsShortFetch {
  page: number;
  size: number;
  rows: NewsModel[];
  totalRows: number;
}

export default class NewsModel {
  public id?: string | null;
  public status?: NewsStatus | null;
  public header?: string | null;
  public annotation?: string | null;
  public content?: string | null;
  public publishAt?: Date | null;

  public static fetchShortNewsList (params?: INewsFetchParams): Promise<AxiosResponse<INewsShortFetch>> {
    return axios.get('/api/news/list', { params: params || null });
  }

  public static getFullNews (newsId: string): Promise<AxiosResponse<NewsModel>> {
    return axios.get('/api/news/by_id/' + newsId);
  }

  public static formAdminPutNews () {
    return new Form({
      id: null,
      status: '',
      header: '',
      annotation: '',
      content: '',
      publishAt: new Date()

    }, async (model) => {
      return axios.put('/api/admin/news', model);
    });
  }

  public static adminDeleteNews (newsId: string) {
    return axios.delete('/api/admin/news/' + newsId);
  }
}
