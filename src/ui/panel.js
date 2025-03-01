import { PANEL_ASSET_KEYS } from "../keys/asset.js";

export class Panel {

    static #CONFIG = {
        width: 0,
        height: 168,
        padding: 5,
        colors: {
            background: 0x333333,
            frameBorder: 0x000000,
            frameEnemy: 0x9e2b18,
            framePlayer: 0x139c13,
            line: 0x646464,
            shadow: 0x000000,
            health: 0xd40200,
            mana: 0x5487ff,
            coin: 0x8c7533,
            
            enemy: 0x4db02f,
            player: 0x07bafc,
        }
    };

    /** @type {Phaser.Scene} */
    #scene;
    #container;
    #config;

    #units;

    #stats;
    #statsText;

    /** @type {number} */
    #hp;
    /** @type {number} */
    #maxHp;
    #textHp;
    /** @type {number} */
    #exp;
    /** @type {number} */
    #maxExp;
    #textExp;
    /** @type {number} */
    #gold;
    #textGold;

    /**
     * @param {Phaser.Scene} scene - The scene this panel belongs to
     * @param {number} x - The x coordinate of the tile on the grid
     * @param {number} y - The y coordinate of the tile on the grid
     */
    constructor(scene, x, y) {
        this.#scene = scene;
        this.#container = scene.add.container(x, y);

        this.#hp = this.#maxHp = 20;
        this.#exp = 0;
        this.#maxExp = 1;//20;
        this.#gold = 0;

        this.#config = {
            ...Panel.#CONFIG,
            width: this.#scene.game.canvas.width,
        };
        
        this.#container.add([
            this.#createBackground(0, 100, 0x000000),
        ]);

        this.#units = [];
        this.#statsText = [];

        const stats = [
            { name: "HP", text: this.#hp + "/" + this.#maxHp },
            { name: "XP", text: this.#exp + "/" + this.#maxExp },
            { name: "Gold", text: this.#gold }
        ];

        let label = this.#createText(10, 3, "HP:", 30, 0.8);
        this.#container.add(label);
        this.#textHp = this.#createText(80, 3, "0", 30, 0.8);
        this.#container.add(this.#textHp);

        label = this.#createText(10, 33, "EXP:", 30, 0.8);
        this.#container.add(label);
        this.#textExp = this.#createText(80, 33, "0", 30, 0.8);
        this.#container.add(this.#textExp);

        label = this.#createText(10, 63, "GOLD:", 30, 0.8);
        this.#container.add(label);
        this.#textGold = this.#createText(80, 63, "0", 30, 0.8);
        this.#container.add(this.#textGold);

        this.updateExp(0);
        this.updateGold(0);
        this.updateHp(0);
    }

    shouldLevelUp() {
        return this.#exp >= this.#maxExp;
    }

    updateHp(amount) {
        this.#hp = Math.min(this.#hp + amount, this.#maxHp);
        this.#textHp.setText(this.#hp + "/" + this.#maxHp);
    }

    updateExp(amount) {
        this.#exp += amount;
        this.#textExp.setText(this.#exp + "/" + this.#maxExp);
    }

    updateGold(amount) {
        this.#gold += amount;
        this.#textGold.setText(this.#gold.toString());
    }

    #createBackground(y, height, color, alpha = 1) {
        return this.#scene.add.rectangle(
            0, y, 
            this.#config.width, 
            height, 
            color
        ).setOrigin(0, 0).setAlpha(alpha);
    }

    #createText(x, y, text, size = 20, alpha = 1) {
        return this.#scene.add.bitmapText(
            x, y, 
            PANEL_ASSET_KEYS.FONT, 
            text, 
            size
        ).setTint(this.#config.colors.text)
         .setOrigin(0)
         .setAlpha(alpha);
    }
}
