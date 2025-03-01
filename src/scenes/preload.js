import Phaser from "../lib/phaser.js";

import { SCENE_KEYS } from "../keys/scene.js";
import { FONT_ASSET_KEYS, PANEL_ASSET_KEYS, BLOCK_ASSET_KEYS, UNIT_ASSET_KEYS, UI_ASSET_KEYS, MAP_ASSET_KEYS, DATA_ASSET_KEYS } from "../keys/asset.js";

export class PreloadScene extends Phaser.Scene {
    constructor() {
        super({
            key: SCENE_KEYS.PRELOAD_SCENE,
        });
    }

    preload() {
        // TODO: Resize and unscale
        this.load.spritesheet(BLOCK_ASSET_KEYS.BACKGROUND, 'assets/tilesets/block/background.png', {
            frameWidth: 44,
            frameHeight: 44,
        });
        this.load.spritesheet(UI_ASSET_KEYS.SKILL, 'assets/tilesets/skill.png', {
            frameWidth: 60,
            frameHeight: 60,
        });
        this.load.spritesheet(UI_ASSET_KEYS.BUBBLE, 'assets/tilesets/bubble.png', { frameWidth: 5, frameHeight: 5 });
        this.load.spritesheet(MAP_ASSET_KEYS.UNIT, 'assets/tilesets/unit.png', { frameWidth: 12, frameHeight: 12 });
        this.load.spritesheet(MAP_ASSET_KEYS.WORLD, 'assets/tilesets/world.png', { frameWidth: 12, frameHeight: 12 });

        this.load.image(BLOCK_ASSET_KEYS.BLANK, 'assets/images/blank.png');
        // TODO: Resize and unscale and uncolor
        this.load.spritesheet(BLOCK_ASSET_KEYS.ICON, 'assets/tilesets/block/icon.png', {
            frameWidth: 28,
            frameHeight: 28,
        });
        this.load.spritesheet(UNIT_ASSET_KEYS.BACKGROUND, 'assets/tilesets/unit/background.png', {
            frameWidth: 48,
            frameHeight: 72,
        });
        this.load.spritesheet(PANEL_ASSET_KEYS.ICON, 'assets/tilesets/panel/icon.png', {
            frameWidth: 16,
            frameHeight: 20,
        });
        
        // TODO: Resize and unscale
        this.load.image(PANEL_ASSET_KEYS.BACKGROUND, 'assets/tilesets/panel/background.png');
        
        this.load.bitmapFont(PANEL_ASSET_KEYS.FONT, 'assets/fonts/panel/font.png', 'assets/fonts/panel/font.xml');
        this.load.bitmapFont(FONT_ASSET_KEYS.POINT, 'assets/fonts/point/font.png', 'assets/fonts/point/font.xml');

        this.load.json(DATA_ASSET_KEYS.SKILL, 'assets/data/skills.json');
    }

    create() {
        this.scene.start(SCENE_KEYS.DUNGEON_SCENE);
    }
}
