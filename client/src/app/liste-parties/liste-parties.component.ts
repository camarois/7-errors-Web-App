import { Component } from "@angular/core";
import { Router, NavigationEnd } from "@angular/router";
import { ListePartieServiceService } from "./liste-partie-service.service";
import { TempsUser } from "../admin/dialog-abstrait";
import { PartieMultiple } from "../admin/dialog-multiple/partie-multiple";
import { PartieSimple } from "../admin/dialog-simple/partie-simple";

@Component({
  selector: "app-liste-parties",
  templateUrl: "./liste-parties.component.html",
  styleUrls: ["./liste-parties.component.css"],
  providers: [ListePartieServiceService]
})

export class ListePartiesComponent {

  protected jouerOuReinitialiser: string;
  protected creerOuSupprimer: string;
  protected joindreOuSupprimer: string;
  protected isListePartiesMode: boolean;
  protected isAdminMode: boolean;
  protected isElevatedActive: boolean;
  protected listePartiesEnAttente: Array<string>;
  protected username: string;

  public constructor(public router: Router,
                     public listePartieService: ListePartieServiceService) {
    this.username = "username";
    this.jouerOuReinitialiser = "";
    this.creerOuSupprimer = "";
    this.joindreOuSupprimer = "";
    this.isListePartiesMode = false;
    this.isAdminMode = false;
    this.listePartiesEnAttente = new Array<string>();
    this.changerBoutonSelonRouter(router);
  }

  protected ajusterImage(id: string, listeParties: Array<PartieSimple | PartieMultiple>, isPartieSimple: Boolean): void {
    for (const partie of listeParties) {
      if (partie["_id"] === id) {
        let data: string = "";

        isPartieSimple ? data = atob(String(partie["_image1"][0])) : data = atob(String(partie["_image1PV1"][0]));

        let hex = 0x00;
        const result: Uint8Array = new Uint8Array(data.length);

        for (let i = 0; i < data.length; i++) {
            hex = data.charCodeAt(i);
            result[i] = hex;
        }
        const blob = new Blob([result], {type: 'image/bmp'});
        const element: HTMLImageElement = document.getElementById(id) as HTMLImageElement;
        element.src = URL.createObjectURL(blob);
      }
    }
  }

  protected setjouerOuReinitialiserAndcreerOuSupprimer(url: string): void {
    if (url === "/liste-parties") {
      this.setToJouerAndCreer();
    } else if (url === "/admin") {
      this.setToReinitialiserAndSupprimer();
    }
  }

  protected getTitleFirstLetter(title: String): String {

    return title.substr(0, 1);
  }

  protected getTitleWithoutFirstLetter(title: string): string {

    return title.substr(1, title.length - 1);
  }

  protected getDisplayTime(temps: TempsUser): string {
    const minutes = Math.floor(temps["_temps"] / 60);
    const secondes = temps["_temps"] - minutes * 60;

    return (secondes < 10) ? (minutes + ":0" + secondes) : minutes + ":" + secondes;
  }

  protected genererTableauTempsAleatoires(): Array<TempsUser> {
    const arr: Array<TempsUser> = [];
    for (let i: number = 1; i < 4; i++) {
      arr.push(new TempsUser("Joueur" + i, this.genererTempsAleatoire()));
    }
    this.getSortedTimes(arr);

    return arr;
}

  private genererTempsAleatoire(): number {
    return Math.floor(Math.random() * 400) + 100;
  }

  private getSortedTimes(arr: Array<TempsUser>): Array<TempsUser> {
    if (arr) {
      arr.sort((t1: TempsUser, t2: TempsUser) => {
        const time1: number = t1["_temps"];
        const time2: number = t2["_temps"];
        if (time1 > time2) { return 1; }
        if (time1 < time2) { return -1; }

        return 0;
      });
    }

    return arr;
  }

  private setToJouerAndCreer(): void {
    this.isAdminMode = false;
    this.isListePartiesMode = true;
    this.jouerOuReinitialiser = "Jouer";
    this.creerOuSupprimer = "Créer";
    this.joindreOuSupprimer = "Joindre";
  }

  private setToReinitialiserAndSupprimer(): void {
    this.isListePartiesMode = false;
    this.isAdminMode = true;
    this.jouerOuReinitialiser = "Réinitialiser";
    this.creerOuSupprimer = "Supprimer";
    this.joindreOuSupprimer = "Supprimer";
  }

  private changerBoutonSelonRouter(router: Router): void {
    router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        this.setjouerOuReinitialiserAndcreerOuSupprimer(val.url);
      }
    });
  }

}
