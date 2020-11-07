import { Player, SettleDebtResult } from '../types'

export const capitalizeString = (string: string) => string.charAt(0).toUpperCase() + string.toLowerCase().slice(1)

type NameBalance = {
  name: string
  balance: number
  skip?: boolean
}

export const settleDebts = (players: Player[], currency = '') => {
  let totalGameBalance = 0
  const givers: NameBalance[] = []
  const receivers: NameBalance[] = []
  const result: SettleDebtResult = { warningMsg: '', transfers: [] }

  players.forEach(({ name, balance }) => {
    totalGameBalance += balance
    if (balance >= 0) {
      receivers.push({ name, balance })
    } else {
      givers.push({ name, balance: -balance })
    }
  })

  if (totalGameBalance < 0 && receivers.length === 0) {
    return result
  }

  givers.sort(customDescendingSort)
  receivers.sort(customDescendingSort)

  const residualSign = totalGameBalance > 0 ? -1 : 1 // less : more
  const averageResidual = (totalGameBalance / receivers.length) * residualSign
  const averageResidualText = Math.abs(averageResidual).toFixed(2)

  if (totalGameBalance !== 0 && averageResidualText !== '0.00') {
    receivers.forEach((receiver) => (receiver.balance += averageResidual))
    result.warningMsg += `Every winner receives ${averageResidualText} ${totalGameBalance > 0 ? 'less' : 'more'}`
  }

  for (let giver of givers) {
    for (let receiver of receivers) {
      if (receiver.balance !== 0) {
        const amount = giver.balance >= receiver.balance ? receiver.balance : giver.balance
        giver.balance -= amount
        receiver.balance -= amount
        result.transfers.push(
          `${capitalizeString(giver.name)} sends ${currency}${Math.abs(amount).toFixed(2)} to ${capitalizeString(
            receiver.name
          )}`
        )
        if (giver.balance === 0) break
      }
    }
  }
  return result
}

type SortTargetObject = Pick<Player, 'name' | 'balance'>
const customDescendingSort = (a: SortTargetObject, b: SortTargetObject) => (a.balance > b.balance ? -1 : 1)
