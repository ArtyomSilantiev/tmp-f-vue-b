import axios, { AxiosResponse } from 'axios';
import Form from '../lib/form';

export interface IImageFetchParams {
  page?: string | number;
  pageSize?: string | number;
  sortBy?: string | null;
  sortDesc?: string | null;
}

export interface IImageFetchResult {
  page: number;
  size: number;
  rows: ImageModel[];
  totalRows: number;
}

export default class ImageModel {
  id?: string | null;
  uuid?: string | null;
  sha256HashHex?: string | null;
  width?: number | null;
  height?: number | null;
  size?: number | null;
  createdAt?: Date | null;

  public static adminFetchImages (params: IImageFetchParams): Promise<AxiosResponse<IImageFetchResult>> {
    return axios.get('/api/admin/image/list', { params: params || null });
  }
}

export class FormAdminFormUploadImage extends Form <Promise<AxiosResponse<{}>>> {
  public model = {
    imageFile: new Blob()
  };
  public tmpModel = null;
  protected submitAction () {
    const form = new FormData();
      form.append('imageFile', this.model.imageFile);
      return axios.post('/api/admin/image/upload', form);
  }
}
