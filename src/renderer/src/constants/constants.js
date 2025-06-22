export const allNavigableViews = [
  { name: 'TeamsView', title: 'Brackets View', icon: 'mdi-tournament', path: '/TeamsView' },
  { name: 'PlayerStats', title: 'Players Stats', icon: 'mdi-account-star', path: '/PlayerStats' },
  {
    name: 'TodayMatches',
    title: "Today's Matches",
    icon: 'mdi-calendar-today',
    path: '/TodayMatches'
  }
]

export const initializeTeams = () => {
  const teams = {}
  for (let i = 1; i <= 32; i++) {
    teams[i] = {
      id: i,
      teamImage: '',
      flagImage: '',
      teamName: '',
      score: 0
    }
  }
  return teams
}

export const createInitialPlayerState = () => ({
  playerName: '',
  teamName: '',
  favouriteWeapon: '',
  economyScore: 0,
  heroImage: '',
  kills: 0,
  deaths: 0,
  assists: 0
})

const createMatchDetails = () => ({
  matchTime: '',
  leftTeamName: '',
  rightTeamName: '',
  leftTeamLogo: '',
  rightTeamLogo: '',
  leftTeamFlag: '',
  rightTeamFlag: ''
})

export const createInitialMatchState = () => ({
  date: '',
  firstMatch: createMatchDetails(),
  secondMatch: createMatchDetails()
})
