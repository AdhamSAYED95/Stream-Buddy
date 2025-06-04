import { defineStore } from 'pinia'

export const useAppStateStore = defineStore('appState', {
  state: () => ({
    players: {
      PlayerName: '',
      TeamName: '',
      FavouriteWeapon: '',
      EconomyScore: 0,
      HeroImage: '',
      Kills: 0,
      Deaths: 0,
      Assists: 0
    },
    teams: initializeTeams(),
    matches: {
      date: '',
      firstMatch: {
        MatchTime: '',
        leftTeamName: '',
        rightTeamName: '',
        leftTeamLogo: '',
        rightTeamLogo: '',
        leftTeamFlag: '',
        rightTeamFlag: ''
      },
      secondMatch: {
        MatchTime: '',
        leftTeamName: '',
        rightTeamName: '',
        leftTeamLogo: '',
        rightTeamLogo: '',
        leftTeamFlag: '',
        rightTeamFlag: ''
      }
    }
  }),
  actions: {
    clearAllData() {
      this.players = {
        PlayerName: '',
        TeamName: '',
        FavouriteWeapon: '',
        EconomyScore: 0,
        HeroImage: '',
        Kills: 0,
        Deaths: 0,
        Assists: 0
      }
      this.teams = initializeTeams()
      this.matches = {
        date: '',
        firstMatch: {
          MatchTime: '',
          leftTeamName: '',
          rightTeamName: '',
          leftTeamLogo: '',
          rightTeamLogo: '',
          leftTeamFlag: '',
          rightTeamFlag: ''
        },
        secondMatch: {
          MatchTime: '',
          leftTeamName: '',
          rightTeamName: '',
          leftTeamLogo: '',
          rightTeamLogo: '',
          leftTeamFlag: '',
          rightTeamFlag: ''
        }
      }
    }
  },
  persist: {
    key: 'app-state',
    storage: localStorage
  }
})

function initializeTeams() {
  const initialTeamsObject = {}
  for (let i = 1; i < 33; i++) {
    initialTeamsObject[i] = {
      id: i,
      TeamImage: '',
      FlagImage: '',
      TeamName: '',
      Score: 0
    }
  }
  return initialTeamsObject
}
