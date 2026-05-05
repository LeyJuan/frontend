import * as MuiIcons from '@mui/icons-material'

export function getIcon(iconName) {
  return MuiIcons[iconName] || MuiIcons.HelpOutline
}