import Phaser from "../lib/phaser.js";

import { SCENE_KEYS } from "../keys/scene.js";
import { Tile } from "../grid/tile.js";
import { Panel } from "../ui/panel.js";
import { Skills } from "../skills.js";
import { Grid } from "../grid/grid.js";

export class DungeonScene extends Phaser.Scene {
    // TODO: Create a panel class to inherit both
    /** @type {Panel} */
    #panel;
    /** @type {Skills} */
    #skills;

    /** @type {Grid} */
    #grid;

    constructor() {
        super({
            key: SCENE_KEYS.DUNGEON_SCENE,
        });
    }

    create() {
        this.#grid = new Grid(this, 7, 9);
        this.#grid.setCallbacks(
            this.#tileSelected.bind(this),
            this.#showStreaks.bind(this),
            this.#endTurn.bind(this)
        );
        this.#grid.create();
        this.#grid.reset();

        this.#panel = new Panel(this, 0, 0);

        this.#skills = new Skills(this, 0, this.game.scale.height, this.#useSkill.bind(this));
        this.#skills.container.y -= this.#skills.container.getBounds().height;

        this.#skills.addSkill("destroy_everything");
        this.#skills.addSkill("convert_gold_to_exp");
        this.#skills.addSkill("gold_value");

        // this.time.delayedCall(800, () => {
        //     let popup = new Popup(this, (skillId) => {
        //         console.log(skillId);
        //         this.#skills.addSkill(skillId);

        //         popup.hide();
        //     });
        //     popup.show();
        // });
    }

    /**
     * @param {Object} points
     */
    #showStreaks(points) {
        if (points.exp > 0) {
            this.#panel.updateExp(points.exp);
        }
        if (points.hp > 0) {
            this.#panel.updateHp(points.hp);
        }
        if (points.gold > 0) {
            this.#panel.updateGold(points.gold);
        }
        if (points.monster > 0) {
            this.#panel.updateHp(-points.monster);
        }
    }

    #tileSelected(tile) {
        // Disable PANEL click
    }

    /**
     * @param {string} skillId
     */
    #useSkill(skillId) {
        console.log(this);
        this.#grid.disableSelect();
        console.log("USE SKILL: " + skillId);
    }

    #endTurn() {
        console.log("DUNGEON-SCENE: END TURN");

        if (this.#panel.shouldLevelUp()) {
            // do {

            // } while (this.#panel.shouldLevelUp());
            // return;
        }

        this.#skills.endTurn();

        this.#grid.enableSelect();
    }

}
