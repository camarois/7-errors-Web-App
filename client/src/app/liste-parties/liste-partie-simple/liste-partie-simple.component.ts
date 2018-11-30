import {Component, OnInit, AfterContentChecked, ErrorHandler} from "@angular/core";
import {ListePartiesComponent} from "../liste-parties.component";
import {Router} from "@angular/router";
import { DomSanitizer } from "@angular/platform-browser";
import {ListePartieServiceService} from "../liste-partie-service.service";
import {PartieSimple} from "../../admin/dialog-simple/partie-simple";
import {MatDialog} from "@angular/material";
import {DialogConfirmationComponent} from "../dialog-confirmation/dialog-confirmation.component";
import {SocketClientService} from "src/app/socket/socket-client.service";
import * as event from "../../../../../common/communication/evenementsSocket";
import {DialogVueAttenteComponent} from "../dialog-vue-attente/dialog-vue-attente.component";

@Component({
    selector: "app-liste-partie-simple",
    templateUrl: "./liste-partie-simple.component.html",
    styleUrls: ["./liste-partie-simple.component.css"],
    providers: [SocketClientService]
})

export class ListePartieSimpleComponent extends ListePartiesComponent implements OnInit, AfterContentChecked {

    protected listeParties: PartieSimple[];
    protected listePartieEnAttente: string[];

    public constructor(public router: Router,
                       public sanitizer: DomSanitizer,
                       public listePartieService: ListePartieServiceService,
                       public socketClientService: SocketClientService,
                       private dialog: MatDialog) {
        super(router, sanitizer, listePartieService);
        this.listeParties = [];
        this.listePartieEnAttente = [];
    }

    public ngOnInit(): void {
        this.listePartieService.getListePartieSimple().subscribe((res: PartieSimple[]) => {
            this.listeParties = res;
        });
        this.listePartieService.getListePartieSimpleEnAttente().subscribe((res: string[]) => {
            this.listePartieEnAttente = res;
        });

        this.ajouterPartieSurSocketEvent();
    }

    public ngAfterContentChecked(): void  {
        for (const partie of this.listeParties) {
            this.afficherImage(partie.id);
        }
    }

    protected afficherImage(id: string): void {
        this.ajusterImage(id, this.listeParties, true);
    }

    protected onJouerOuReinitialiserClick(partieId: string): void {
        if (this.isListePartiesMode) {
            this.router.navigate(["/partie-simple/" + partieId + "/0"])
                .catch(() => ErrorHandler);
        } else if (this.isAdminMode) {
            this.reinitialiserTemps(partieId);
        }
    }

    protected async onCreerOuSupprimerClick(partieId: string): Promise<void> {
        if (this.isListePartiesMode) {
            await this.checkJoindreOuSupprimer(partieId);
        } else if (this.isAdminMode) {
            this.ouvrirDialogConfirmation(partieId);
        }
    }

    protected reinitialiserTemps(partieId: string): void {
        this.listeParties.forEach((partie: PartieSimple) => {
            if (partie.id === partieId) {
                partie.tempsSolo = this.genererTableauTempsAleatoires();
                partie.tempsUnContreUn = this.genererTableauTempsAleatoires();
                this.listePartieService.reinitialiserTempsPartie(partieId, partie.tempsSolo, partie.tempsUnContreUn)
                    .catch(() => ErrorHandler);
            }
        });
    }

    private async checkJoindreOuSupprimer(partieId: string): Promise<void> {
        if (this.listePartieEnAttente.includes(partieId)) {
            const channelId: string = await this.getChannelId();
            this.listePartieService.joindrePartieMultijoueurSimple(partieId, channelId).catch(() => ErrorHandler);
            this.router.navigate(["/partie-simple/" + partieId + "/" + channelId])
                .catch(() => ErrorHandler);
        } else {
            this.listePartieService.addPartieSimpleEnAttente(partieId).subscribe(() => {
                this.ouvrirDialogVueAttente(partieId);
            });
        }
    }

    private async getChannelId(): Promise<string> {
        return this.listePartieService.getChannelIdSimple();
    }

    private ouvrirDialogVueAttente(partieId: string): void {
        this.dialog.open(DialogVueAttenteComponent, {
            height: "220px",
            width: "600px",
            data: {
                id: partieId,
                isSimple: true
            }
        });
    }

    private ouvrirDialogConfirmation(partieId: string): void {
        this.dialog.open(DialogConfirmationComponent, {
            height: "190px",
            width: "600px",
            data: {
                id: partieId,
                listeParties: this.listeParties,
                isSimple: true
            }
        });
    }

    private ajouterPartieSurSocketEvent(): void {
        this.socketClientService.socket.on(event.ENVOYER_PARTIE_SIMPLE, (data) => {
            this.listeParties.push(data);
        });

        this.socketClientService.socket.on(event.ENVOYER_PARTIE_SIMPLE_ATTENTE, (data) => {
            this.listePartieEnAttente.push(data);
        });

        this.socketClientService.socket.on(event.DELETE_PARTIE_SIMPLE_ATTENTE, (data) => {
            for (let i: number = 0; i < this.listePartieEnAttente.length; i++) {
                if (this.listePartieEnAttente[i] === data) {
                    this.listePartieEnAttente.splice(i, 1);
                }
            }
        });

        this.socketClientService.socket.on(event.DIALOG_ATTENTE_MULTIPLE_FERME, () => {
            this.mettreBoutonsACreer();
        });

        this.socketClientService.socket.on(event.JOINDRE_PARTIE_MULTIJOUEUR_SIMPLE, (data) => {
            this.mettreBoutonsACreer();
        });
    }
}
