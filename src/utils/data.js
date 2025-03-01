import Phaser from '../lib/phaser.js';

import { DATA_ASSET_KEYS } from '../keys/asset.js';

export class Data {
    /**
     * @param {Phaser.Scene} scene 
     * @param {string} skillId  
     */
    static getSkill(scene, skillId) {
        /** @type {SkillData[]} */
        const data = scene.cache.json.get(DATA_ASSET_KEYS.SKILL);

        return data.find((skill) => skill.id === skillId);
    }
    static getSkills(scene) {
        /** @type {SkillData[]} */
        const data = scene.cache.json.get(DATA_ASSET_KEYS.SKILL);

        return data;
    }
}
