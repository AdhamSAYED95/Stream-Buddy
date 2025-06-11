import { defineStore } from 'pinia'

export const useAppStateStore = defineStore('appState', {
  state: () => ({
    players: {
      playerName: '',
      teamName: '',
      favouriteWeapon: '',
      economyScore: 0,
      heroImage: '',
      kills: 0,
      deaths: 0,
      assists: 0
    },
    teams: initializeTeams(),
    matches: {
      date: '',
      firstMatch: {
        matchTime: '',
        leftTeamName: '',
        rightTeamName: '',
        leftTeamLogo: '',
        rightTeamLogo: '',
        leftTeamFlag: '',
        rightTeamFlag: ''
      },
      secondMatch: {
        matchTime: '',
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
        playerName: '',
        teamName: '',
        favouriteWeapon: '',
        economyScore: 0,
        heroImage: '',
        kills: 0,
        deaths: 0,
        assists: 0
      }
      this.teams = initializeTeams()
      this.matches = {
        date: '',
        firstMatch: {
          matchTime: '',
          leftTeamName: '',
          rightTeamName: '',
          leftTeamLogo: '',
          rightTeamLogo: '',
          leftTeamFlag: '',
          rightTeamFlag: ''
        },
        secondMatch: {
          matchTime: '',
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
      teamImage: '',
      flagImage: '',
      teamName: '',
      score: 0
    }
  }
  return initialTeamsObject
}
