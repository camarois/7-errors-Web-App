import { Component, OnInit } from "@angular/core";
import { ListePartiesComponent } from "../liste-parties.component";
import { Router } from "@angular/router";
import {ListePartieServiceService} from "../liste-partie-service.service";
import { PartieSimple } from "../../admin/dialog-simple/partie-simple";

@Component({
  selector: "app-liste-partie-simple",
  templateUrl: "./liste-partie-simple.component.html",
  styleUrls: ["./liste-partie-simple.component.css"]
})
export class ListePartieSimpleComponent extends ListePartiesComponent implements OnInit {

  protected listeParties: PartieSimple[];

  constructor(public router: Router,
              public listePartieService: ListePartieServiceService) {
    super(router, listePartieService);
  }

  public ngOnInit() {
    this.listePartieService.getListeImageSimple().subscribe((res: PartieSimple[]) => {
      this.listeParties = res;
    });
  }

  public onJouerOuReinitialiserClick(partieId: string): void {
    if (this.isListePartiesMode) {
      this.router.navigate(["/partie-solo"]);
    } else if (this.isAdminMode) {
      this.reinitialiserTemps(partieId);
    }
  }

  protected onCreerOuSupprimerClick(partieId: string): void {
    if (this.isListePartiesMode) {
      // Naviguer vers partie-multijouer
    } else if (this.isAdminMode) {
      this.supprimerPartie(partieId);
    }
  }

  protected supprimerPartie(partieId: string): void {
    this.listePartieService.deletePartieSimple(partieId);
  }

  private reinitialiserTemps(partieId: string): void {
    this.listeParties.forEach((partie: PartieSimple) => {
      if (partie._id === partieId) {
        partie._tempsSolo.forEach((ts) => {
          ts = 0;
        });
        partie._tempsUnContreUn.forEach((t1v1) => {
          t1v1 = 0;
        });
      }
    });
    this.listePartieService.reinitialiserTempsPartie(partieId);
  }

}
