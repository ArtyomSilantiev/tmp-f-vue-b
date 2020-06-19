import axios, { AxiosAdapter, AxiosResponse } from 'axios';
import Form from '../lib/form';

export interface IPageGetResult {
  id: string;
  name: string;
  data: any;
}

export default class PageModel {
  public id?: string | null;
  public name?: string | null;
  public data?: any | null;

  public static async getPage (name: string): Promise<AxiosResponse<IPageGetResult>> {
    return axios.get('/api/page/by_name/' + name);
  }

  public static formAdminSetPage (name: string) {
    return new Form({
      name,
      data: null
    }, async (model) => {
      return axios.post('/api/admin/page/change', {
        name: model.name,
        data: model.data
      });
    });
  }
}
