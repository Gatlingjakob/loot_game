Refactor to make the script OOP - here's my pseudocode:

Class Item

string name - item name 
int level_requirement - determined by either player level when the item drops, or zone level of where the item drops
slot/type - hands, feet, head, weapon (1-hand axe, 2-hand axe, 1-hand sword, 2-hand sword, spear, polearm, dagger shield, etc), etc
enum rarity - common, uncommon, rare, epic, legendary
list stats - strength, agility, crit chance, etc, can roll with maybe 1-2 stats/affixes at low levels, 4-6 at higher levels, based on loot tiers that correpond to level requirement
bool is_unique - used to handle items with special abilities - legendaries for example
bool is_weapon (maybe weapons and armor should be different classes that inherit Item?)
double weapon_damage - damage per attack
double attack_speed - how fast the weapon can attack (essentially a cooldown determining how often the weapon can attack)
double damage_per_second - weapon_damage/attack_speed
string flavor_text
damage type - physical, fire, poison, etc (can be multiple at ones, most are just physical, but some are phys + fire for example, stuff like wands are pure magic/fire/lightning damage etc) 

I also need to make a Stat Class containing all the different types of stats/abilities/affixes like:
strength
intelligence
attack power
attack speed 
added elemental damage
movement speed
exp % increase
special abilites for uniques - could be something like a special buff that stacks on the player whenever the weapon hits its target

up next:
item seed system 
only certain stats and names should go on certain item types at certain level tiers
weapon damage type and flat added damage type on items