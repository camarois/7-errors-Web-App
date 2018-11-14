export const BASE_URL: string = "http://localhost:3000/";
export const SIMPLE: string = "partieSimple/";
export const MULTIPLE: string = "partieMultiple/";

export const GET_LISTE_SIMPLE_URL: string = BASE_URL + SIMPLE + "getListePartieSimple";
export const DELETE_PARTIE_SIMPLE_URL: string = BASE_URL + SIMPLE + "delete/";
export const REINITIALISER_TEMPS_SIMPLE_URL: string = BASE_URL + SIMPLE + "reinitialiseTemps/";

export const GET_PARTIE_SIMPLE_ATTENTE: string = BASE_URL + "getPartieSimpleEnAttente/";
export const ADD_PARTIE_SIMPLE_ATTENTE: string = BASE_URL + "addPartieSimpleEnAttente/";
export const DELETE_PARTIE_SIMPLE_ATTENTE: string = BASE_URL + "deletePartieSimpleEnAttente/";

export const GET_LISTE_MULTIPLE_URL: string = BASE_URL + MULTIPLE + "getListePartieMultiple";
export const DELETE_PARTIE_MULTIPLE_URL: string = BASE_URL + MULTIPLE + "delete/";
export const REINITIALISER_TEMPS_MULTIPLE_URL: string = BASE_URL + MULTIPLE + "reinitialiseTemps/";

export const GET_PARTIE_MULTIPLE_ATTENTE: string = BASE_URL + "getPartieSimpleEnAttente/";
export const ADD_PARTIE_MULTIPLE_ATTENTE: string = BASE_URL + "addPartieSimpleEnAttente/";
export const DELETE_PARTIE_MULTIPLE_ATTENTE: string = BASE_URL + "deletePartieSimpleEnAttente/";