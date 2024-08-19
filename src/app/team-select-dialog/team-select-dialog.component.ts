import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MappedTeam, TeamSelectService } from './team-select.service';
import { generateMatrix } from '../calculator/calculator.helpers';
import { Character, Party, Tile } from '../calculator/calculator.types';
import { createParty } from 'src/fn/helpers';
import { CharacterService } from '../character-service/character-service.service';


export type TeamSelectDialogDisaplayDataItem = {
  team: MappedTeam;
  matrix: Array<Tile>;
  party: Party;
};
export type TeamSelectDialogDisaplayData = Array<TeamSelectDialogDisaplayDataItem>;
export type TeamSelectDialogResult = {
  teamData: TeamSelectDialogDisaplayDataItem,
  asEvil: boolean,
};
export interface TeamSelectDialogData {
  isEvil: boolean;
}

@Component({
  templateUrl: './team-select-dialog.component.html',
  styleUrls: ['./team-select-dialog.component.scss']
})
export class TeamSelectDialogComponent {

  public displayData:TeamSelectDialogDisaplayData = [];

  constructor(
    public dialogRef: MatDialogRef<TeamSelectDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TeamSelectDialogData,
    public teamSelectService: TeamSelectService,
    private characterService: CharacterService,
  ) { }

  ngOnInit() {
    this.generateDisplayData();
  }

  public generateDisplayData() {
    const teams = this.teamSelectService.getTeams(this.data.isEvil).teams;
    this.displayData = teams.map<TeamSelectDialogDisaplayDataItem>((team) => {
      const matrix = generateMatrix();
      console.log(team);
      const party = this.createParty(team, matrix);
      return {
        team,
        matrix,
        party, 
      }
    });
  }

  public createParty(team: MappedTeam, matrix: Array<Tile>) {
    const party = createParty('TestParty', () => {});

    team.forEach(([id, char, weapon], i) => {
      let tile: Tile;
      let character: Character;
      if (char) {
        character = this.characterService.getCharacterWithWeapon(String(char), String(weapon));
      }
      if (id !== null && id !== undefined) {
        tile = matrix[id as unknown as number];
      } else {
        tile = party.tiles[i];
      }
      
      tile.character = character;
      tile.positionInParty = i;
      party.tiles[i] = tile;
    });
    
    return party;
  }

  public deleteTeam(teamData: TeamSelectDialogDisaplayDataItem) {
    this.teamSelectService.deleteTeam(teamData.team, this.data.isEvil);
    this.generateDisplayData();
  }

  public loadTeam(teamData: TeamSelectDialogDisaplayDataItem) {
    this.dialogRef.close({
      teamData,
      asEvil: this.data.isEvil,
    } as TeamSelectDialogResult)
  }
}
