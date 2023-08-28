/* tslint:disable */
import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpResponse, HttpHeaders } from '@angular/common/http';
import { BaseService as __BaseService } from '../base-service';
import { ApiConfiguration as __Configuration } from '../api-configuration';
import { StrictHttpResponse as __StrictHttpResponse } from '../strict-http-response';
import { Observable as __Observable } from 'rxjs';
import { map as __map, filter as __filter } from 'rxjs/operators';

import { CommandeFournisseurDto } from '../models/commande-fournisseur-dto';
import { LigneCommandeFournisseurDto } from '../models/ligne-commande-fournisseur-dto';
@Injectable({
  providedIn: 'root',
})
class CommandefournisseurService extends __BaseService {
  static readonly findAllPath = 'api/CommandFrs/all';
  static readonly savePath = 'api/CommandFrs/create';
  static readonly deleteArticlePath = 'api/CommandFrs/delete/article/{idCommande}/{idLigneCommande}';
  static readonly deletePath = 'api/CommandFrs/delete/{idCommandeFournisseur}';
  static readonly findByCodePath = 'api/CommandFrs/filter/{codeCommandeFournisseur}';
  static readonly findAllLignesCommandesFournisseurByCommandeFournisseurIdPath = '/api/ligneCommandFrs/{idCommande}';
  static readonly updateArticlePath = 'api/CommandFrs/update/article/{idCommande}/{idLigneCommande}/{idArticle}';
  static readonly updateEtatCommandePath = 'api/CommandFrs/update/etat/{idCommande}/{etatCommande}';
  static readonly updateFournisseurPath = 'api/CommandFrs/update/fournisseur/{idCommande}/{idFournisseur}';
  static readonly updateQuantiteCommandePath = 'api/CommandFrs/update/quantite/{idCommande}/{idLigneCommande}/{quantite}';
  static readonly findByIdPath = 'api/CommandFrs/{idCommandeFournisseur}';

  constructor(
    config: __Configuration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * @return successful operation
   */
  findAllResponse(): __Observable<__StrictHttpResponse<Array<CommandeFournisseurDto>>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/api/CommandFrs/all`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<Array<CommandeFournisseurDto>>;
      })
    );
  }
  /**
   * @return successful operation
   */
  findAll(): __Observable<Array<CommandeFournisseurDto>> {
    return this.findAllResponse().pipe(
      __map(_r => _r.body as Array<CommandeFournisseurDto>)
    );
  }

  /**
   * @param body undefined
   * @return successful operation
   */
  saveResponse(body?: CommandeFournisseurDto): __Observable<__StrictHttpResponse<CommandeFournisseurDto>> {
    console.log('save22', body);

    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    __body = body;
    let req = new HttpRequest<any>(
      'POST',
      this.rootUrl + `/api/CommandFrs/create`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<CommandeFournisseurDto>;
      })
    );
  }
  /**
   * @param body undefined
   * @return successful operation
   */
  save(body?: CommandeFournisseurDto): __Observable<CommandeFournisseurDto> {
    console.log('save', body);
    return this.saveResponse(body).pipe(
      __map(_r => _r.body as CommandeFournisseurDto)
    );
  }

  /**
   * @param params The `CommandefournisseurService.DeleteArticleParams` containing the following parameters:
   *
   * - `idLigneCommande`:
   *
   * - `idCommande`:
   *
   * @return successful operation
   */
  deleteArticleResponse(params: CommandefournisseurService.DeleteArticleParams): __Observable<__StrictHttpResponse<CommandeFournisseurDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;


    let req = new HttpRequest<any>(
      'DELETE',
      this.rootUrl + `api/CommandFrs/delete/article/${params.idCommande}/${params.idLigneCommande}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<CommandeFournisseurDto>;
      })
    );
  }
  /**
   * @param params The `CommandefournisseurService.DeleteArticleParams` containing the following parameters:
   *
   * - `idLigneCommande`:
   *
   * - `idCommande`:
   *
   * @return successful operation
   */
  deleteArticle(params: CommandefournisseurService.DeleteArticleParams): __Observable<CommandeFournisseurDto> {
    return this.deleteArticleResponse(params).pipe(
      __map(_r => _r.body as CommandeFournisseurDto)
    );
  }

  /**
   * @param idCommandeFournisseur undefined
   */
  deleteResponse(idCommandeFournisseur: number): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'DELETE',
      this.rootUrl + `/api/CommandFrs/delete/${idCommandeFournisseur}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<null>;
      })
    );
  }
  /**
   * @param idCommandeFournisseur undefined
   */
  delete(idCommandeFournisseur: number): __Observable<null> {
    return this.deleteResponse(idCommandeFournisseur).pipe(
      __map(_r => _r.body as null)
    );
  }

  /**
   * @param codeCommandeFournisseur undefined
   * @return successful operation
   */
  findByCodeResponse(codeCommandeFournisseur: string): __Observable<__StrictHttpResponse<CommandeFournisseurDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `api/CommandFrs/filter/${codeCommandeFournisseur}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<CommandeFournisseurDto>;
      })
    );
  }
  /**
   * @param codeCommandeFournisseur undefined
   * @return successful operation
   */
  findByCode(codeCommandeFournisseur: string): __Observable<CommandeFournisseurDto> {
    return this.findByCodeResponse(codeCommandeFournisseur).pipe(
      __map(_r => _r.body as CommandeFournisseurDto)
    );
  }

  /**
   * @param idCommande undefined
   * @return successful operation
   */
  findAllLignesCommandesFournisseurByCommandeFournisseurIdResponse(idCommande: number): __Observable<__StrictHttpResponse<Array<LigneCommandeFournisseurDto>>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/api/ligneCommandFrs/${idCommande}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<Array<LigneCommandeFournisseurDto>>;
      })
    );
  }
  /**
   * @param idCommande undefined
   * @return successful operation
   */
  findAllLignesCommandesFournisseurByCommandeFournisseurId(idCommande: number): __Observable<Array<LigneCommandeFournisseurDto>> {
    return this.findAllLignesCommandesFournisseurByCommandeFournisseurIdResponse(idCommande).pipe(
      __map(_r => _r.body as Array<LigneCommandeFournisseurDto>)
    );
  }

  /**
   * @param params The `CommandefournisseurService.UpdateArticleParams` containing the following parameters:
   *
   * - `idLigneCommande`:
   *
   * - `idCommande`:
   *
   * - `idArticle`:
   *
   * @return successful operation
   */
  updateArticleResponse(params: CommandefournisseurService.UpdateArticleParams): __Observable<__StrictHttpResponse<CommandeFournisseurDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;



    let req = new HttpRequest<any>(
      'PATCH',
      this.rootUrl + `api/CommandFrs/update/article/${params.idCommande}/${params.idLigneCommande}/${params.idArticle}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<CommandeFournisseurDto>;
      })
    );
  }
  /**
   * @param params The `CommandefournisseurService.UpdateArticleParams` containing the following parameters:
   *
   * - `idLigneCommande`:
   *
   * - `idCommande`:
   *
   * - `idArticle`:
   *
   * @return successful operation
   */
  updateArticle(params: CommandefournisseurService.UpdateArticleParams): __Observable<CommandeFournisseurDto> {
    return this.updateArticleResponse(params).pipe(
      __map(_r => _r.body as CommandeFournisseurDto)
    );
  }

  /**
   * @param params The `CommandefournisseurService.UpdateEtatCommandeParams` containing the following parameters:
   *
   * - `idCommande`:
   *
   * - `etatCommande`:
   *
   * @return successful operation
   */
  updateEtatCommandeResponse(params: CommandefournisseurService.UpdateEtatCommandeParams): __Observable<__StrictHttpResponse<CommandeFournisseurDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;


    let req = new HttpRequest<any>(
      'PATCH',
      this.rootUrl + `api/CommandFrs/update/etat/${params.idCommande}/${params.etatCommande}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<CommandeFournisseurDto>;
      })
    );
  }
  /**
   * @param params The `CommandefournisseurService.UpdateEtatCommandeParams` containing the following parameters:
   *
   * - `idCommande`:
   *
   * - `etatCommande`:
   *
   * @return successful operation
   */
  updateEtatCommande(params: CommandefournisseurService.UpdateEtatCommandeParams): __Observable<CommandeFournisseurDto> {
    return this.updateEtatCommandeResponse(params).pipe(
      __map(_r => _r.body as CommandeFournisseurDto)
    );
  }

  /**
   * @param params The `CommandefournisseurService.UpdateFournisseurParams` containing the following parameters:
   *
   * - `idFournisseur`:
   *
   * - `idCommande`:
   *
   * @return successful operation
   */
  updateFournisseurResponse(params: CommandefournisseurService.UpdateFournisseurParams): __Observable<__StrictHttpResponse<CommandeFournisseurDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;


    let req = new HttpRequest<any>(
      'PATCH',
      this.rootUrl + `api/CommandFrs/update/fournisseur/${params.idCommande}/${params.idFournisseur}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<CommandeFournisseurDto>;
      })
    );
  }
  /**
   * @param params The `CommandefournisseurService.UpdateFournisseurParams` containing the following parameters:
   *
   * - `idFournisseur`:
   *
   * - `idCommande`:
   *
   * @return successful operation
   */
  updateFournisseur(params: CommandefournisseurService.UpdateFournisseurParams): __Observable<CommandeFournisseurDto> {
    return this.updateFournisseurResponse(params).pipe(
      __map(_r => _r.body as CommandeFournisseurDto)
    );
  }

  /**
   * @param params The `CommandefournisseurService.UpdateQuantiteCommandeParams` containing the following parameters:
   *
   * - `quantite`:
   *
   * - `idLigneCommande`:
   *
   * - `idCommande`:
   *
   * @return successful operation
   */
  updateQuantiteCommandeResponse(params: CommandefournisseurService.UpdateQuantiteCommandeParams): __Observable<__StrictHttpResponse<CommandeFournisseurDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;



    let req = new HttpRequest<any>(
      'PATCH',
      this.rootUrl + `api/CommandFrs/update/quantite/${params.idCommande}/${params.idLigneCommande}/${params.quantite}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<CommandeFournisseurDto>;
      })
    );
  }
  /**
   * @param params The `CommandefournisseurService.UpdateQuantiteCommandeParams` containing the following parameters:
   *
   * - `quantite`:
   *
   * - `idLigneCommande`:
   *
   * - `idCommande`:
   *
   * @return successful operation
   */
  updateQuantiteCommande(params: CommandefournisseurService.UpdateQuantiteCommandeParams): __Observable<CommandeFournisseurDto> {
    return this.updateQuantiteCommandeResponse(params).pipe(
      __map(_r => _r.body as CommandeFournisseurDto)
    );
  }

  /**
   * @param idCommandeFournisseur undefined
   * @return successful operation
   */
  findByIdResponse(idCommandeFournisseur: number): __Observable<__StrictHttpResponse<CommandeFournisseurDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `api/CommandFrs/${idCommandeFournisseur}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<CommandeFournisseurDto>;
      })
    );
  }
  /**
   * @param idCommandeFournisseur undefined
   * @return successful operation
   */
  findById(idCommandeFournisseur: number): __Observable<CommandeFournisseurDto> {
    return this.findByIdResponse(idCommandeFournisseur).pipe(
      __map(_r => _r.body as CommandeFournisseurDto)
    );
  }
}

module CommandefournisseurService {

  /**
   * Parameters for deleteArticle
   */
  export interface DeleteArticleParams {
    idLigneCommande: number;
    idCommande: number;
  }

  /**
   * Parameters for updateArticle
   */
  export interface UpdateArticleParams {
    idLigneCommande: number;
    idCommande: number;
    idArticle: number;
  }

  /**
   * Parameters for updateEtatCommande
   */
  export interface UpdateEtatCommandeParams {
    idCommande: number;
    etatCommande: 'EN_PREPARATION' | 'VALIDEE' | 'LIVREE';
  }

  /**
   * Parameters for updateFournisseur
   */
  export interface UpdateFournisseurParams {
    idFournisseur: number;
    idCommande: number;
  }

  /**
   * Parameters for updateQuantiteCommande
   */
  export interface UpdateQuantiteCommandeParams {
    quantite: number;
    idLigneCommande: number;
    idCommande: number;
  }
}

export { CommandefournisseurService }
