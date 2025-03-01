import Phaser from "../lib/phaser.js";

import { BLOCK_ASSET_KEYS, UI_ASSET_KEYS } from "../keys/asset.js";

export class Button {
    /** @type {Phaser.Scene} */
    _scene;

    /** @type {Phaser.GameObjects.Container} */
    _container;
    #background;
    /** @type {Boolean} */
    #selected;
    #isActive;
    #text;

    /**
     * @param {Phaser.Scene} scene 
     */
    constructor(scene, x, y, message, callback) {
        this._scene = scene;

        this.#isActive = true;

        this._container = this._scene.add.container(x, y);

        this.#background = this._scene.add.image(0, 0, UI_ASSET_KEYS.BLANK).setOrigin(0.5);
        this.#background.setTint(0x30484e);
        this.#background.displayHeight = 50;
        this.#background.displayWidth = this._scene.game.scale.width - 80;
        this._container.add(this.#background);

        this.#background.setInteractive();
        this.#background.on('pointerdown', () => {
            if (!this.#isActive) {
                return;
            }
            this.#selected = true;
            this.container.setAlpha(0.8);
        });
        this.#background.on('pointerup', () => {
            if (!this.#isActive || !this.#selected) {
                return;
            }

            this.container.setAlpha(1);
            this.#selected = false;

            if (callback) {
                callback();
            }
        });

        this._scene.input.on('pointerup', (target) => {
            if (!this.#isActive || !this.#selected) {
                return;
            }
            this.container.setAlpha(1);
            this.#selected = false;
        });

        this.#text = this._scene.add.bitmapText(0, this.#background.y, UI_ASSET_KEYS.FONT, message, 20).setTint(0xffffff).setOrigin(0.5);
        this._container.add(this.#text);

        this.#selected = false;
    }

    /** @type {Phaser.GameObjects.Container} */
    get container() { return this._container; }

    setWidth(amount) {
        this.#background.displayWidth = amount;
    }

    activate() {
        console.log("ACTIVATE");
        this.#isActive = true;
        this.container.setAlpha(1);
    }

    desactivate() {
        console.log("DESACTIVATE", this.container.alpha);
        this.#isActive = false;
        this.container.setAlpha(0.5);
        console.log("AFTER: " + this.container.alpha);
    }

    setText(text) {
        this.#text.setText(text);
    }

    /**
     * @param {() => void} [callback] 
     */
    hide(callback) {
        this._scene.add.tween({
            targets: this._container,
            alpha: 0,
            duration: 200,
            onComplete: callback,
        });
    }

    /**
     * @param {() => void} [callback] 
     */
    show(callback) {
        this._scene.add.tween({
            targets: this._container,
            alpha: 1,
            duration: 200,
            onComplete: callback,
        });
    }
}
