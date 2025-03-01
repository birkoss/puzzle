import { MAP_ASSET_KEYS, UI_ASSET_KEYS } from "./keys/asset.js";
import { Data } from "./utils/data.js";

export class Skill {
    /** @type {Phaser.Scene} */
    #scene;
    /** @type {string} */
    #id;

    /** @type {Phaser.GameObjects.Container} */
    #container;

    /** @type {Phaser.GameObjects.BitmapText} */
    #textCoolDown;
    /** @type {number} */
    #cooldown;
    /** @type {number} */
    #maxCooldown;

    /** @type {Phaser.GameObjects.Graphics} */
    #graphics;

    /**
     * @param {Phaser.Scene} scene
     * @param {string} id
     */
    constructor(scene, id) {
        this.#scene = scene;
        this.#id = id;

        this.#cooldown = this.#maxCooldown = -1;

        const data = Data.getSkill(this.#scene, this.#id);
        if (data.cooldown) {
            this.#maxCooldown = data.cooldown;
            this.#cooldown = data.cooldown;
        }

        this.#container = this.#scene.add.container(0, 0);

        let icon = this.#scene.add.image(0, 0, MAP_ASSET_KEYS.WORLD, 230).setScale(3);
        this.#container.add(icon);

        if (this.#cooldown !== -1) {
            this.#graphics = this.#scene.add.graphics();
            this.#container.add(this.#graphics);

            this.#updateCooldown();

            this.#textCoolDown = this.#scene.add.bitmapText(0, 0, UI_ASSET_KEYS.FONT, this.#cooldown.toString(), 30).setOrigin(0.5);
            this.#container.add(this.#textCoolDown);
        }
    }

    get container() { return this.#container; }
    get cooldown() { return this.#cooldown; }
    get description() { return Data.getSkill(this.#scene, this.#id).description; }
    get id() { return this.#id; }
    get maxCooldown() { return this.#maxCooldown; }

    tick() {
        if (this.#cooldown === -1) {
            return;
        }

        this.#cooldown--;

        this.#textCoolDown.setText(this.#cooldown.toString());
        
        this.#updateCooldown();
    }

    use() {
        this.#cooldown = this.#maxCooldown;
        this.#textCoolDown.setText(this.#cooldown.toString());
        this.#updateCooldown();
    }

    #updateCooldown() {
        let diff = (this.#maxCooldown - this.#cooldown) / this.#maxCooldown * 360;
        this.#graphics.clear();
        if (this.#cooldown > 0) {
            this.#graphics.fillStyle(0x000000, 0.6);
            this.#graphics.slice(0,0,27,Phaser.Math.DegToRad(-90),Phaser.Math.DegToRad(270+diff), true)
            this.#graphics.fillPath();
        }
    }
}
