import { Injectable } from '@angular/core';
import { Party } from '../calculator/calculator.types';
import { LocalStorageService } from '../local-storage-service/local-storage-service.service';

export type MappedTeam = Array<Array<number>>;
export type MappedTeams = Array<MappedTeam>;

@Injectable({
  providedIn: 'root'
})
export class TeamSelectService {

  public storageKeyGood = 'savedTeamsGood';
  public storageKeyEvil = 'savedTeamsEvil';

  constructor(
    private localStorageService: LocalStorageService,
  ) { }

  public addTeam(party: Party, isEvil: boolean) {
    const key = isEvil ? this.storageKeyEvil : this.storageKeyGood;
    const { teamsUnparsed, teams } = this.getTeams(isEvil);

    console.log(JSON.stringify(teams, null, 2));

    let teamToSave = this.teamToArr(party);
    let teamToSaveString = JSON.stringify(this.teamToArr(party));

    console.log(teamToSave);

    if (!teamsUnparsed.includes(teamToSaveString)) {
      teams.push(teamToSave);
      this.localStorageService.set(key, teams);
    }
  
    console.log(teams);
  }

  public deleteTeam(teamToRemove: MappedTeam, isEvil: boolean) {
    const key = isEvil ? this.storageKeyEvil : this.storageKeyGood;
    const { teams } = this.getTeams(isEvil);
  
    const filtered = teams.filter((team) => JSON.stringify(team) !== JSON.stringify(teamToRemove));
    
    this.localStorageService.set(key, filtered);
  
    console.log(filtered);
  }

  public getTeams(isEvil: boolean) {
    const key = isEvil ? this.storageKeyEvil : this.storageKeyGood;
    const teamsUnparsed: string = this.localStorageService.getUnparsed(key) || '';
    const teams: MappedTeams = (this.localStorageService.get(key) || []); 
    return { teamsUnparsed, teams }
  }

  public setTeams() {
    
  }

  public teamToArr(party: Party): MappedTeam {
    const reduced: MappedTeam = party.tiles.reduce((acc, e) => {
      const id = e?.id !== undefined && e?.id !== null ? e?.id : null;
      const characterId = e.character?.id || null;
      acc.push([id, characterId, e.character?.weaponEquipped?.id]);
      return acc;
    }, []);
    return reduced;
  }

}
