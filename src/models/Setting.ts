import axios, { AxiosAdapter, AxiosResponse } from 'axios';
import Form from '../lib/form';

export enum SettingType {
  String = 'string',
  Integer = 'integer',
  Decimal = 'decimal',
  Bool = 'bool',
  Text = 'text'
}

export enum SettingColection {
  None = 'none',
  Front = 'front'
}

export interface ISettingColection {
  [key: string]: SettingModel;
}

export default class SettingModel {
  public collection: SettingColection | undefined | null;
  public name: string | undefined | null;
  public type: SettingType | undefined | null;
  public value: string | undefined | null;

  public static async getFrontCollection (): Promise<AxiosResponse<ISettingColection>> {
    return axios.get('/api/setting/front_collection');
  }

  public static async adminGetAllSettings (): Promise<AxiosResponse<SettingModel[]>> {
    return axios.get('/api/admin/setting/all');
  }

  public static async adminGetSettingByName (settingName: string): Promise<AxiosResponse<SettingModel>> {
    return axios.get('/api/admin/setting/by_name?name=' + settingName);
  }
}

export class FormAdminChangeSetting extends Form <Promise<AxiosResponse<{}>>> {
  public model = {
    name: '',
    value: ''
  };
  public tmpModel = null;
  protected submitAction () {
    return axios.post('/api/admin/setting/change', this.model);
  }
}
