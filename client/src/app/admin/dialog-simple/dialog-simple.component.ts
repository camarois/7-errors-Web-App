import { Component, Inject, ErrorHandler } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { DialogData } from "../admin.component";
import { HttpClient } from "@angular/common/http";
import { PartieSimple } from "./partie-simple";
import { PartieSimpleService } from "../partie-simple.service";
import { DialogAbstrait } from "../dialog-abstrait";
import * as Buffer from "buffer";
import { FormControl, Validators } from "@angular/forms";
import * as constante from "src/app/constantes";

export const IMAGE_URL: string = "http://localhost:3000/images/";

const ERR_NB_IMAGE: string = "*L'image doit être de format BMP 24 bits et de taille 640 x 480 pixels";
const ERR_TYPE_IMAGE: string = "*Vous devez entrer deux images.";
const PAS_ERR: string = "";
const IMG_EXTENSION: string = "image/bmp";
const MAX_NB_IMAGE: number = 2;

export interface ImageInfo {
  size: number;
  width: number;
  height: number;
}

@Component({
  selector: "app-dialog-simple",
  templateUrl: "./dialog-simple.component.html",
  styleUrls: ["./dialog-simple.component.css"],
  providers: [PartieSimpleService]})

export class DialogSimpleComponent extends DialogAbstrait {

  // tslint:disable-next-line:no-suspicious-comment
  // TODO faire une classe maybe
  protected premiereImage: string;
  protected deuxiemeImage: string;
  protected erreurNbImage: string;
  protected erreurTypeImage: string;
  protected nomControl: FormControl;

  private nbImage: number;
  private fichier: File[];
  private fichierEnBuffer: Buffer[];
  private imageExtension: string;

  public constructor(
    dialogRef: MatDialogRef<DialogSimpleComponent>,
    @Inject(MAT_DIALOG_DATA) data: DialogData,
    http: HttpClient,
    private partieSimpleService: PartieSimpleService) {

      super(dialogRef, data, http);
      this.fichier = [];
      this.fichierEnBuffer = [];
      this.imageExtension = IMG_EXTENSION;
      this.erreurTypeImage = PAS_ERR;
      this.erreurNbImage = PAS_ERR;
      this.nomControl = new FormControl("", [
        Validators.minLength(constante.LONGUEUR_NOM_MIN),
        Validators.maxLength(constante.LONGUEUR_NOM_MAX),
        Validators.required]);
    }

  protected onClickAjouterPartie(): void {
      this.setErreurNbImage();
      this.fermerDialog();
    }

  protected onSubmit(): void {
    let imageQty: number = 0;

    this.fichier.forEach((file) => {
      const reader: FileReader = new FileReader();
      reader.readAsArrayBuffer(file);

      reader.onload = () => {
        this.convertirArrayBufferEnBuffer(reader.result as ArrayBuffer, imageQty);
        if (this.fichierEnBuffer.length === MAX_NB_IMAGE) {
          this.ajouterPartie()
          .catch(() => ErrorHandler);
        }
        imageQty++;
      };
    });
  }

  protected async ajouterPartie(): Promise<void> {
    const result: PartieSimple = new PartieSimple(this.data.simpleGameName, this.genererTableauTempsAleatoires(),
                                                  this.genererTableauTempsAleatoires(), this.fichierEnBuffer[0],
                                                  this.fichierEnBuffer[1], new Array<Array<string>>());
    this.partieSimpleService.register(result)
      .subscribe(
        () => {
          // tslint:disable-next-line:no-suspicious-comment
          // TODO: do something
        },
        (error) => {
          console.error(error);
        });
}

  protected onAjoutImage(event: Event, i: number): void {
    this.nbImage = i;
    const target: HTMLInputElement = event.target as HTMLInputElement;
    const fichiers: FileList = target.files as FileList;
    this.fichier[this.nbImage] = fichiers[0] as File;
    this.convertirImageEnArray(this.fichier[this.nbImage]);
    this.afficherImageSurUploadClient();
}

  protected contientErreur(): boolean {
    return !(this.estVide(this.erreurNbImage) &&
            this.estVide(this.erreurTypeImage));
}

  private setErreursImage(imageInfo: ImageInfo): void {
    this.estBonneTaille(imageInfo) || this.estBonType() ?
    this.erreurTypeImage = PAS_ERR :
    this.erreurTypeImage = ERR_NB_IMAGE;

  }

  private setErreurNbImage(): void {
    this.estBonNombre() ?
    this.erreurNbImage = PAS_ERR :
    this.erreurNbImage = ERR_TYPE_IMAGE;
  }

  private estBonneTaille(imageInfo: ImageInfo): boolean {
    return (imageInfo.size === constante.BIT_FORMAT
            || imageInfo.width === constante.WINDOW_WIDTH
            || imageInfo.height === constante.WINDOW_HEIGHT);
  }

  private estBonType(): boolean {
    let estMauvaisType: boolean = false;
    this.fichier.forEach((file) => {
    if (file.type === this.imageExtension || file === undefined) {
      estMauvaisType = true;
    }
  });

    return estMauvaisType;
  }

  private estBonNombre(): boolean {
    return !(this.fichier[0] === undefined || this.fichier[0] === null
      || this.fichier[1] === undefined || this.fichier[1] === null);
  }

  private afficherImageSurUploadClient(): void {
    const reader: FileReader = new FileReader();
    reader.readAsDataURL(this.fichier[this.nbImage]);
    reader.onload = () => {
      (this.nbImage) ? this.deuxiemeImage = reader.result as string : this.premiereImage = reader.result as string;
    };
  }

  private convertirArrayBufferEnBuffer(file: ArrayBuffer, i: number): void {
    this.fichierEnBuffer[i] = Buffer.Buffer.from(file);
  }

  private convertirImageEnArray(file: File): void {
    const self: DialogSimpleComponent = this;
    const reader: FileReader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload = () => {
      const dv: DataView = new DataView(reader.result as ArrayBuffer);
      const imageInfo: ImageInfo = {
        size: dv.getUint16(constante.HEADER_BMP_P1, true),
        width: dv.getUint32(constante.HEADER_BMP_P2, true),
        height: dv.getUint32(constante.HEADER_BMP_P3, true)
      };
      self.setErreursImage(imageInfo);
    };
  }

}
