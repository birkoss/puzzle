import Phaser from "./lib/phaser.js";

import { MAP_ASSET_KEYS, UI_ASSET_KEYS } from "./keys/asset.js";
import { Bubble } from "./ui/bubble.js";
import { Button } from "./ui/button.js";
import { Toggle } from "./ui/toggle/toggle.js";
import { ToggleButton } from "./ui/toggle/button.js";
import { Data } from "./utils/data.js";

export class Popup {
    /** @type {Phaser.Scene} */
    #scene;
    
    /** @type {Phaser.GameObjects.Container} */
    #container;
    /** @type {Phaser.GameObjects.Image} */
    #background;
    /** @type {Phaser.GameObjects.BitmapText} */
    #text;

    /** @type {SkillData[]} */
    #skills;

    #bubble;

    #toggle;

    /**
     * @param {Phaser.Scene} scene 
     * @param {(skillId: string) => void} [callback]
     */
    constructor(scene, callback) {
        this.#scene = scene;

        const skills = Data.getSkills(this.#scene);
        Phaser.Utils.Array.Shuffle(skills);
        this.#skills = skills.slice(0, 3);

        this.#background = this.#scene.add.image(this.#scene.game.canvas.width/2, this.#scene.game.canvas.height/2, UI_ASSET_KEYS.BLANK).setOrigin(0.5).setTint(0x000000);
        this.#background.displayWidth = this.#scene.game.canvas.width;
        this.#background.displayHeight = 200;
        this.#background.setInteractive();

        this.#container = this.#scene.add.container(this.#background.x, this.#background.y);

        this.#text = this.#scene.add.bitmapText(0, 0, UI_ASSET_KEYS.FONT, "Pick a new skill", 40).setTint(0xfff2e8).setOrigin(0.5).setAlpha(1);
        this.#container.add(this.#text);

        let btn = new Button(this.#scene, 0, 230, "PICK SKILL", () => {
            if (callback) {
                callback(this.#skills[this.#toggle.getSelectedValue()].id);
            }
        });
        this.#container.add(btn.container);
        
        this.#toggle = new Toggle((value) => {
            if (this.#bubble) {
                this.#bubble.container.removeAll(true);
            }
            this.#bubble = new Bubble({
                scene: this.#scene,
                message: this.#skills[value].description,
                x: 0,
                y: 150,
                minSize: { width: 200, height: 32 },
                scale: 3,
                tailPosition: parseInt(value),
            });
            this.#container.add(this.#bubble.container);
        });

        const button_y = 80;

        let toggleBotton = new ToggleButton(this.#scene, 0, button_y, UI_ASSET_KEYS.TOGGLE, "0");
        toggleBotton.container.x -= (toggleBotton.container.getBounds().width/2) * 2 + 12;
        toggleBotton.addIcon(MAP_ASSET_KEYS.WORLD, 32);
        this.#toggle.add(toggleBotton);
        this.#container.add(toggleBotton.container);
        
        toggleBotton = new ToggleButton(this.#scene, 0, button_y, UI_ASSET_KEYS.TOGGLE, "1");
        toggleBotton.addIcon(MAP_ASSET_KEYS.WORLD, 33);
        this.#toggle.add(toggleBotton);
        this.#container.add(toggleBotton.container);

        toggleBotton = new ToggleButton(this.#scene, 0, button_y, UI_ASSET_KEYS.TOGGLE, "2");
        toggleBotton.container.x += (toggleBotton.container.getBounds().width/2) * 2 + 12;
        toggleBotton.addIcon(MAP_ASSET_KEYS.WORLD, 33);
        this.#toggle.add(toggleBotton);
        this.#container.add(toggleBotton.container);

        this.#toggle.select(this.#toggle.buttons[0]);

        this.#container.y -= this.#container.getBounds().height/2;
    }

    /** @type {Phaser.GameObjects.Container} */
    get container() { return this.#container; }

    /**
     * @param {() => void} [callback]
     */
    show(callback) {
        this.#background.displayHeight = 0;
        this.#background.setAlpha(0.8);

        this.#container.setAlpha(0);

        this.#scene.add.tween({
            targets: this.#container,
            alpha: 1,
            duration: 400,
        });
        this.#scene.add.tween({
            targets: this.#background,
            displayHeight: this.#scene.game.canvas.height,
            duration: 200,
            onComplete:  callback
        });
    }

    hide(callback) {
        this.#scene.add.tween({
            targets: this.#container,
            alpha: 0,
            duration: 400,
        });
        this.#scene.add.tween({
            targets: this.#background,
            displayHeight: 0,
            duration: 200,
            onComplete: () => {
                this.#container.removeAll(true);
                this.#background.destroy();
                if (callback) {
                    callback();
                }
            }
        });
    }
}
