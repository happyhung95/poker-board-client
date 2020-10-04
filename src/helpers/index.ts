import { Player } from '../types'

export const capitalizeString = (string: string) => string.charAt(0).toUpperCase() + string.toLowerCase().slice(1)

type NameBalance = {
  name: string
  balance: number
  skip?: boolean
}

type Result = {
  warningMsg: string
  transfers: string[]
}

export const settleDebts = (players: Player[]) => {
  let totalGameBalance = 0
  const givers: NameBalance[] = []
  const receivers: NameBalance[] = []
  const result: Result = { warningMsg: '', transfers: [] }

  players.forEach(({ name, balance }) => {
    totalGameBalance += balance
    if (balance >= 0) {
      receivers.push({ name, balance })
    } else {
      givers.push({ name, balance: -balance })
    }
  })

  givers.sort(customDescendingSort)
  receivers.sort(customDescendingSort)

  const residualSign = totalGameBalance > 0 ? -1 : 1 // less : more
  const averageResidual = (totalGameBalance / receivers.length) * residualSign

  if (totalGameBalance !== 0) {
    receivers.forEach((receiver) => (receiver.balance += averageResidual))
    result.warningMsg += `Every winner receives ${Math.abs(averageResidual).toFixed(2)} ${
      totalGameBalance > 0 ? 'less' : 'more'
    }`
  }

  for (let giver of givers) {
    for (let receiver of receivers) {
      if (receiver.balance !== 0) {
        if (giver.balance >= receiver.balance) {
          const amount = receiver.balance
          giver.balance -= amount
          receiver.balance -= amount
          result.transfers.push(
            `${capitalizeString(giver.name)} sends ${amount.toFixed(2)} to ${capitalizeString(receiver.name)}`
          )
          if (giver.balance === 0) break
        } else {
          const amount = giver.balance
          giver.balance -= amount
          receiver.balance -= amount
          result.transfers.push(
            `${capitalizeString(giver.name)} sends ${amount.toFixed(2)} to ${capitalizeString(receiver.name)}`
          )
          if (giver.balance === 0) break
        }
      }
    }
  }

  return result
}

type SortTargetObject = Pick<Player, 'name' | 'balance'>
const customDescendingSort = (a: SortTargetObject, b: SortTargetObject) => (a.balance > b.balance ? -1 : 1)
