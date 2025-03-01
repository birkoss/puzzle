import Phaser from "../lib/phaser.js";

import { SCENE_KEYS } from "../keys/scene.js";
import { Tile } from "../grid/tile.js";
import { Panel } from "../ui/panel.js";
import { Skills } from "../skills.js";
import { Grid } from "../grid/grid.js";
import { UI_ASSET_KEYS } from "../keys/asset.js";

export class DungeonScene extends Phaser.Scene {
    // TODO: Create a panel class to inherit both
    /** @type {Panel} */
    #panel;
    /** @type {Skills} */
    #skills;

    /** @type {Grid} */
    #grid;

    /** @type {Phaser.GameObjects.Zone} */
    #noClick;

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

    #enableClick() {
        this.#noClick.destroy();
    }

    #disableClick() {
        this.#noClick = this.add.zone(0, 0, this.scale.width, this.scale.height).setOrigin(0);
        this.#noClick.setInteractive();
        this.#noClick.on('pointerdown', (pointer, x, y, event) => {
            event.stopPropagation();
        });
        this.#noClick.on('pointerup', (pointer, x, y, event) => {
            event.stopPropagation();
        });
    }

    #tileSelected(tile) {
        this.#disableClick();
    }

    /**
     * @param {string} skillId
     */
    #useSkill(skillId) {
        console.log(this);
        this.#disableClick();
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

        this.#enableClick();
    }

}
