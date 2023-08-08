/* tslint:disable */
import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpResponse, HttpHeaders } from '@angular/common/http';
import { BaseService as __BaseService } from '../base-service';
import { ApiConfiguration as __Configuration } from '../api-configuration';
import { StrictHttpResponse as __StrictHttpResponse } from '../strict-http-response';
import { Observable as __Observable } from 'rxjs';
import { map as __map, filter as __filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
class PhotosService extends __BaseService {
  static readonly savePhotoPath = '/api/article/{id}/{title}/{context}';

  constructor(
    config: __Configuration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * @param params The `PhotosService.SavePhotoParams` containing the following parameters:
   *
   * - `title`:
   *
   * - `id`:
   *
   * - `file`:
   *
   * - `context`:
   *
   * @return successful operation
   */
  uploadArticleImage(idArticle: any, file: File) {
    if (!file) {
      console.log('Please select an image and enter an Article ID.');
      return;
    }

    const formData = new FormData();
    formData.append('image', file, file.name);

    return this.http.post(`http://localhost:3000/api/photo/upload/${idArticle}`, formData);
  }
  
  savePhotoResponse(params: PhotosService.SavePhotoParams): __Observable<__StrictHttpResponse<{}>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let __formData = new FormData();
    __body = __formData;


    if (params.file != null) { __formData.append('file', params.file as string | Blob);}

    let req = new HttpRequest<any>(
      'POST',
      this.rootUrl + `/api/photo/upload/${params.id}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<{}>;
      })
    );
  }
  /**
   * @param params The `PhotosService.SavePhotoParams` containing the following parameters:
   *
   * - `title`:
   *
   * - `id`:
   *
   * - `file`:
   *
   * - `context`:
   *
   * @return successful operation
   */
  savePhoto(params: PhotosService.SavePhotoParams): __Observable<{}> {
    return this.savePhotoResponse(params).pipe(
      __map(_r => _r.body as {})
    );
  }
}

module PhotosService {

  /**
   * Parameters for savePhoto
   */
  export interface SavePhotoParams {
    title: string;
    id: number;
    file: Blob;
    context: string;
  }
  export interface updatePhotoParams {
    id : number;
    file: File
  }
}

export { PhotosService }