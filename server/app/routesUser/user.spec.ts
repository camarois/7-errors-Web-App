import { assert } from "chai";
import { RouteUser } from "./user";

describe("BaseDeDonnees", () => {
    describe("Constructeur", () => {
        let user: RouteUser.User;
        beforeEach(() => {
            user = new RouteUser.User();
        });

        it ("should do nothing", () => {
            assert(true);
        });

        it ("should be defined", () => {
            assert.isDefined(user);
        });

    });
});
