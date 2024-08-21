import './style.css'

const $ = (id) => document.querySelector(id)
const $$ = (id) => document.querySelectorAll(id)

const ROWS = 10
const COLUMNS = 10
const FIRST_CHAR_CODE = 65

const $table = $('table')
const $thead = $('thead')
const $tbody = $('tbody')

const times = (length) => Array.from({ length }, (_, i) => i)

const getColumn = (index) => String.fromCharCode(FIRST_CHAR_CODE + index)

let selectedColumn = null
let selectedRow = null

let STATE = times(COLUMNS).map((i) =>
  times(ROWS).map((j) => ({
    computedValues: 0,
    value: 0
  }))
)

console.log(STATE)

function updateCell(x, y, value) {
  const newState = structuredClone(STATE)

  const constants = generateCellsConstants(newState)

  const cell = newState[x][y]
}

function generateCellsConstants(cells) {
  return cells
    .map((rows, x) => {
      return rows
        .map((cell, y) => {
          const letter = getColumn(x) // -> A
          const cellId = `${letter}${y + 1}` // -> A1
          return `const ${cellId} = ${cell.computedValue};`
        })
        .join('\n')
    })
    .join('\n')
}

function computeAllCells(cells, constants) {
  console.log('computeAllCells')
  cells.forEach((rows, x) => {
    rows.forEach((cell, y) => {
      const computedValue = computeValue(cell.value, constants)
      cell.computedValue = computedValue
    })
  })
}

function computeValue(value, constants) {
  if (typeof value === 'number') return value
  if (!value.startsWith('=')) return value

  const formula = value.slice(1)

  let computedValue
  try {
    computedValue = eval(`(() => {
    ${constants}
    return ${formula};
  })()`)
  } catch (e) {
    computedValue = `!ERROR: ${e.message}`
  }

  console.log({ value, computedValue })

  return computedValue
}

const renderSpreadSheet = () => {
  const headerHTML = `<tr>
      <th></th>
      ${times(COLUMNS)
        .map((i) => `<th>${getColumn(i)}</th>`)
        .join('')}
    </tr>`

  $head.innerHTML = headerHTML

  const bodyHTML = times(ROWS)
    .map((row) => {
      return `<tr>
      <td>${row + 1}</td>
      ${times(COLUMNS)
        .map(
          (column) => `
      <td data-x="${column}" data-y="${row}">
        <span>${STATE[column][row].computedValue}</span>
        <input type="text" value="${STATE[column][row].value}" />
      </td>
      `
        )
        .join('')}
    </tr>`
    })
    .join('')

  $body.innerHTML = bodyHTML
}
