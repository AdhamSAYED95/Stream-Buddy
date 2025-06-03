import { defineStore } from 'pinia'

export const useAppStateStore = defineStore('appState', {
  state: () => ({
    players: {
      PlayerName: '',
      TeamName: '',
      FavouriteWeapon: '',
      EconomyScore: 0,
      HeroImage: null,
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
        leftTeamLogo: null,
        rightTeamLogo: null,
        leftTeamFlag: null,
        rightTeamFlag: null
      },
      secondMatch: {
        MatchTime: '',
        leftTeamName: '',
        rightTeamName: '',
        leftTeamLogo: null,
        rightTeamLogo: null,
        leftTeamFlag: null,
        rightTeamFlag: null
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
        HeroImage: null,
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
          leftTeamLogo: null,
          rightTeamLogo: null,
          leftTeamFlag: null,
          rightTeamFlag: null
        },
        secondMatch: {
          MatchTime: '',
          leftTeamName: '',
          rightTeamName: '',
          leftTeamLogo: null,
          rightTeamLogo: null,
          leftTeamFlag: null,
          rightTeamFlag: null
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
      TeamImage: null,
      FlagImage: null,
      TeamName: '',
      Score: 0
    }
  }
  return initialTeamsObject
}
