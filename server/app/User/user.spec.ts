import { assert } from "chai";
import { DBUser } from "./user";

describe("BaseDeDonnees", () => {
    describe("Constructeur", () => {
        let user: DBUser.User;
        beforeEach(() => {
            user = new DBUser.User();
        });

        it ("should do nothing", () => {
            assert(true);
        });

        it ("should be defined", () => {
            assert.isDefined(user);
        });

    });
});