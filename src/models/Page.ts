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
}

export class FormAdminSetPage extends Form <Promise<AxiosResponse<{}>>> {
  public model = {
    name,
    data: null
  };
  public tmpModel = null;
  protected submitAction () {
    return axios.post('/api/admin/page/change', this.model);
  }
}
