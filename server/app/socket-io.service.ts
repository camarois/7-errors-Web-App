import * as http from "http";
import * as socket from "socket.io";
import * as event from "../../common/communication/evenementsSocket";
import { injectable } from "inversify";
import { PartieSimpleInterface } from "./partieSimple/DB-partie-simple/DB-partie-simple";
import { PartieMultipleInterface } from "./partieMultiple/DB-partie-multiple/DB-partie-multiple";

@injectable()
export class SocketServerService {

    public io: SocketIO.Server;

    // tslint:disable-next-line:no-empty
    public constructor() {
    }

    public init(server: http.Server): void {
        this.io = socket(server);
        this.setOnEvents();
    }

    private setOnEvents(): void {
        this.io.on(event.DIALOG_ATTENTE_FERME, () => {
            this.io.emit(event.DIALOG_ATTENTE_FERME);
        });

        this.io.on(event.JOINDRE_PARTIE_MULTIJOUEUR, (partieId: string) => {
            this.io.emit(event.JOINDRE_PARTIE_MULTIJOUEUR, partieId);
        });

    }

    public envoyerMessageErreurNom(msg: string): void {
        this.io.emit(event.ENVOYER_MESSAGE_NOM_PRIS, msg);
    }

    public envoyerMessageErreurDifferences(msg: string): void {
        this.io.emit(event.ENVOYER_MESSAGE_BMPDIFF, msg);
    }

    public envoyerPartieSimple(partieSimple: PartieSimpleInterface): void {
        this.io.emit(event.ENVOYER_PARTIE_SIMPLE, partieSimple);
    }

    public envoyerPartieSimpleAttente(partieId: string): void {
        this.io.emit(event.ENVOYER_PARTIE_SIMPLE_ATTENTE, partieId);
    }

    public supprimerPartieSimpleAttente(partieId: string): void {
        this.io.emit(event.DELETE_PARTIE_SIMPLE_ATTENTE, partieId);
    }

    public envoyerPartieMultiple(partieMultiple: PartieMultipleInterface): void {
        this.io.emit(event.ENVOYER_PARTIE_MULTIPLE, partieMultiple);
    }

    public supprimerPartieSimple(partieId: string): void {
        this.io.emit(event.DELETE_PARTIE_SIMPLE, partieId);
    }

    public supprimerPartieMultiple(partieId: string): void {
        this.io.emit(event.DELETE_PARTIE_MULTIPLE, partieId);
    }

    public envoyerPartieMultipleAttente(partieId: string): void {
        this.io.emit(event.ENVOYER_PARTIE_MULTIPLE_ATTENTE, partieId);
    }

    public supprimerPartieMultipleAttente(partieId: string): void {
        this.io.emit(event.DELETE_PARTIE_MULTIPLE_ATTENTE, partieId);
    }
    public envoyerJoindreSimple(partieId: string, channelId: string): void {
        this.io.emit(event.JOINDRE_PARTIE_MULTIJOUEUR_SIMPLE, { partieId, channelId });
    }

    public envoyerJoindreMultiple(partieId: string, channelId: string): void {
        this.io.emit(event.JOINDRE_PARTIE_MULTIJOUEUR_MULTIPLE, { partieId, channelId });
    }
}