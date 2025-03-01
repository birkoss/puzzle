import { BLOCK_ASSET_KEYS, MAP_ASSET_KEYS, PANEL_ASSET_KEYS, UI_ASSET_KEYS, UNIT_ASSET_KEYS } from "./keys/asset.js";
import { Skill } from "./skill.js";
import { Bubble } from "./ui/bubble.js";
import { Button } from "./ui/button.js";
import { ToggleButton } from "./ui/toggle/button.js";
import { Toggle } from "./ui/toggle/toggle.js";
import { Data } from "./utils/data.js";

export class Skills {
    /** @type {Phaser.Scene} */
    #scene;
    /** @type {Phaser.GameObjects.Container} */
    #container;

    #toggle;

    #btnUse;
    #btnHelp;

    #skills;

    /**
     * @param {Phaser.Scene} scene - The scene this panel belongs to
     * @param {number} x - The x coordinate of the tile on the grid
     * @param {number} y - The y coordinate of the tile on the grid
     */
    constructor(scene, x, y) {
        this.#scene = scene;
        this.#container = scene.add.container(x, y);

        this.#skills = [];

        this.#toggle = new Toggle((value) => {
            let cooldown = this.#skills[parseInt(this.#toggle.getSelectedValue())].cooldown;

            if (cooldown === -1) {
                this.#btnUse.desactivate();
                this.#btnUse.setText("No activation needed");
            } else if (cooldown === 0) {
                this.#btnUse.activate();
                this.#btnUse.setText("USE SKILL");
            } else {
                this.#btnUse.desactivate();
                this.#btnUse.setText("Wait " + cooldown + " turns");
            }
        });

        let frame = this.#scene.add.image(0, 0, BLOCK_ASSET_KEYS.BLANK).setOrigin(0).setTint(0x000000);
        frame.displayWidth = this.#scene.game.scale.width;
        frame.displayHeight = 220;
        this.#container.add(frame);

        let button_y = 45;

        let toggleButton = new ToggleButton(this.#scene, (this.#scene.game.scale.width/2), button_y, UI_ASSET_KEYS.TOGGLE, "0");
        toggleButton.container.x -= (toggleButton.container.getBounds().width/2) * 3 + 15;
        this.#container.add(toggleButton.container);
        this.#toggle.add(toggleButton);

        toggleButton = new ToggleButton(this.#scene, (this.#scene.game.scale.width/2), button_y, UI_ASSET_KEYS.TOGGLE, "1");
        toggleButton.container.x -= (toggleButton.container.getBounds().width/2) + 5;
        this.#container.add(toggleButton.container);
        this.#toggle.add(toggleButton);

        toggleButton = new ToggleButton(this.#scene, (this.#scene.game.scale.width/2), button_y, UI_ASSET_KEYS.TOGGLE, "2");
        toggleButton.container.x += (toggleButton.container.getBounds().width/2) + 5;
        this.#container.add(toggleButton.container);
        this.#toggle.add(toggleButton);

        toggleButton = new ToggleButton(this.#scene, (this.#scene.game.scale.width/2), button_y, UI_ASSET_KEYS.TOGGLE, "3");
        toggleButton.container.x += (toggleButton.container.getBounds().width/2) * 3 + 15;
        this.#container.add(toggleButton.container);
        this.#toggle.add(toggleButton);

        button_y += 70;

        toggleButton = new ToggleButton(this.#scene, (this.#scene.game.scale.width/2), button_y, UI_ASSET_KEYS.TOGGLE, "4");
        toggleButton.container.x -= (toggleButton.container.getBounds().width/2) * 3 + 15;
        this.#container.add(toggleButton.container);
        this.#toggle.add(toggleButton);

        toggleButton = new ToggleButton(this.#scene, (this.#scene.game.scale.width/2), button_y, UI_ASSET_KEYS.TOGGLE, "5");
        toggleButton.container.x -= (toggleButton.container.getBounds().width/2) + 5;
        this.#container.add(toggleButton.container);
        this.#toggle.add(toggleButton);

        toggleButton = new ToggleButton(this.#scene, (this.#scene.game.scale.width/2), button_y, UI_ASSET_KEYS.TOGGLE, "6");
        toggleButton.container.x += (toggleButton.container.getBounds().width/2) + 5;
        this.#container.add(toggleButton.container);
        this.#toggle.add(toggleButton);

        toggleButton = new ToggleButton(this.#scene, (this.#scene.game.scale.width/2), button_y, UI_ASSET_KEYS.TOGGLE, "7");
        toggleButton.container.x += (toggleButton.container.getBounds().width/2) * 3 + 15;
        this.#container.add(toggleButton.container);
        this.#toggle.add(toggleButton);

        if (this.#toggle.buttons.length > 0) {
            this.#toggle.select(this.#toggle.buttons[0]);
        }

        let maxWidth = 4 * toggleButton.container.getBounds().width + 3 * 10;

        this.#btnUse = new Button(this.#scene, this.#scene.game.scale.width/2 - 33, frame.displayHeight, "USE SKILL", () => {
            console.log("USE SKILL");
        });
        this.#btnUse.container.y -= this.#btnUse.container.getBounds().height/2 + 15;
        this.#btnUse.setWidth(maxWidth - 50 - 15);
        if (this.#toggle.buttons.length === 0) {
            this.#btnUse.desactivate();
        }
        this.#container.add(this.#btnUse.container);

        this.#btnHelp = new Button(this.#scene, this.#scene.game.scale.width/2 + 110, frame.displayHeight, "?", () => {
            console.log( this.#toggle.getSelectedValue() );
            
            let description = this.#skills[parseInt(this.#toggle.getSelectedValue())].description;
            if (this.#skills[parseInt(this.#toggle.getSelectedValue())].cooldown === -1) {
                description += "\n\nThis is a passive skill.";
            } else {
                description += "\n\nCooldown: " + this.#skills[parseInt(this.#toggle.getSelectedValue())].maxCooldown + " turns";  
            }

            let bubble = new Bubble({
                scene: this.#scene,
                message: description,
                x: frame.displayWidth/2,
                y: frame.displayHeight/2 - 28,
                minSize: { width: 230, height: 80 },
                scale: 3,
                tailPosition: 6,
                showBackground: true,
            });
            this.#container.add(bubble.container);
            bubble.show();
        });
        this.#btnHelp.container.y -= this.#btnHelp.container.getBounds().height/2 + 15;
        this.#btnHelp.setWidth(50);
        if (this.#toggle.buttons.length === 0) {
            this.#btnHelp.desactivate();
        }
        this.#container.add(this.#btnHelp.container);
    }

    get container() { return this.#container; }

    /**
     * @param {string} skillId 
     */
    addSkill(skillId) {
        const skill = new Skill(this.#scene, skillId);

        this.#skills.push(skill);

        let toggleButton = this.#toggle.getAllButtons().find((button) => !button.isActive);
        toggleButton.add(skill.container);

        this.#btnHelp.activate();
        // this.#btnUse.activate();

        if (this.#toggle.buttons.length === 1) {
            this.#toggle.select(this.#toggle.buttons[0]);
        }
    }
}
