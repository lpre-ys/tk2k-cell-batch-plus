const path = require('path')

const { BrowserWindow, app, ipcMain, dialog, shell, session } = require('electron')
const { tk2k, getEmptyData, write, read, parser } = require('tk2k-clipdata')

let mainWindow

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 1100,
    height: 900,
    resizable: true,
    title: '一括指定 Plus',
    webPreferences: {
      preload: path.resolve(__dirname, '../electron/preload.js')
      // additionalArguments: [`storedLanguage=${store.get('lang', 'ja')}`]
    },
    icon: path.resolve(__dirname, '../asset/icon.ico')
  })

  mainWindow.loadFile('dist/index.html')
  // mainWindow.webContents.openDevTools();

  mainWindow.setMenu(null)

  // 外部URL表示関連
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url)
    return { action: 'deny' }
  })
}
// Passthrough is not supported, GL is disabled, ANGLE is とか言ぁE��ラーを消すヤチEapp.disableHardwareAcceleration()

app.whenReady().then(() => {
  session.defaultSession.setPermissionRequestHandler((webContents, permission, callback) => {
    if (permission === 'geolocation') {
      callback(false)
      return
    }
    callback(true)
  })
  createWindow()
})

app.once('window-all-closed', () => app.quit())

ipcMain.handle('read-info', () => {
  console.log('read-info')

  return read(tk2k.ANIME)
    .then((data) => {
      const effectList = parser
        .parseList(data.effectList.raw, tk2k.ANIME_EFFECT)
        .map(({ data }) => {
          const sound = parser.parseObject(data.sound.raw, tk2k.SOUND)
          return {
            frame: data.frame ? parser.parseBer(data.frame.raw) : 0,
            sound: {
              file: sound.file ? parser.parseString(sound.file.raw) : '',
              volume: sound.volume ? parser.parseBer(sound.volume.raw) : 100,
              pitch: sound.pitch ? parser.parseBer(sound.pitch.raw) : 100,
              pan: sound.pan ? parser.parseBer(sound.pan.raw) : 50
            },
            flash: {
              area: data.area ? parser.parseBer(data.area.raw) : 0,
              r: data.r ? parser.parseBer(data.r.raw) : 31,
              g: data.g ? parser.parseBer(data.g.raw) : 31,
              b: data.b ? parser.parseBer(data.b.raw) : 31,
              volume: data.volume ? parser.parseBer(data.volume.raw) : 0
            }
          }
        })

      const frameList = parser.parseList(data.frameList.raw, tk2k.ANIME_FRAME)
      const frameLength = frameList.length
      const allCellList = []
      frameList.forEach((frame, frameNo) => {
        const celList = parser
          .parseList(frame.data.celList.raw, tk2k.ANIME_CEL)
          .map(({ data }, id) => {
            const visible = data.visible ? parser.parseBer(data.visible.raw) : true
            return {
              frame: frameNo + 1,
              no: id + 1,
              visible: !!visible,
              pattern: (data.pattern ? parser.parseBer(data.pattern.raw) : 0) + 1,
              x: data.x ? parser.parseBer(data.x.raw) : 0,
              y: data.y ? parser.parseBer(data.y.raw) : 0,
              scale: data.scale ? parser.parseBer(data.scale.raw) : 100,
              r: data.r ? parser.parseBer(data.r.raw) : 100,
              g: data.g ? parser.parseBer(data.g.raw) : 100,
              b: data.b ? parser.parseBer(data.b.raw) : 100,
              sat: data.sat ? parser.parseBer(data.sat.raw) : 100,
              alpha: data.alpha ? parser.parseBer(data.alpha.raw) : 0
            }
          })
        allCellList.push(...celList)
      })

      const result = {}
      result.title = data.title ? parser.parseString(data.title.raw) : ''
      result.material = data.material ? parser.parseString(data.material.raw) : ''
      result.target = parser.parseBer(data.target.raw)
      result.yLine = parser.parseBer(data.yLine.raw)
      result.effects = effectList
      result.frame = frameLength
      result.cells = allCellList
      return result
    })
    .catch((error) => {
      console.log(error)
      if (error && error.includes('read.ps1:6')) {
        dialog.showErrorBox(
          '読み込みに失敗しました',
          [
            'クリップボード上にデータが存在しません',
            ' ',
            'RPGツクール2000/2003の戦闘アニメデータをコピーしてから',
            '読み込みボタンを押してください'
          ].join('\n')
        )
        return false
      }
      throw new Error(error)
    })
})

ipcMain.handle('write-anime', (event, jsonData) => {
  console.log('write-anime!!!')

  const animeData = JSON.parse(jsonData)

  const anime = getEmptyData(tk2k.ANIME)
  anime.title.data = animeData.title
  anime.material.data = animeData.material
  anime.target.data = animeData.target
  anime.yLine.data = animeData.yLine

  // エフェクトデータの生成
  anime.effectList.data = animeData.effects
    .filter((effectData) => {
      return effectData.frame > 0
    })
    .map((effectData) => {
      const effect = getEmptyData(tk2k.ANIME_EFFECT)
      effect.frame.data = effectData.frame

      effect.area.data = effectData.flash.area
      if (effectData.flash.area !== 0) {
        effect.r.data = clamp(effectData.flash.r, 0, 31)
        effect.g.data = clamp(effectData.flash.g, 0, 31)
        effect.b.data = clamp(effectData.flash.b, 0, 31)
        effect.volume.data = clamp(effectData.flash.volume, 0, 31)
      }

      const sound = getEmptyData(tk2k.SOUND)
      sound.file.data = effectData.sound.file
      if (!['', '(OFF)'].includes(effectData.sound.file)) {
        sound.volume.data = clamp(effectData.sound.volume, 0, 100)
        sound.pitch.data = clamp(effectData.sound.pitch, 50, 150)
        sound.pan.data = clamp(effectData.sound.pan, 0, 100)
      }
      effect.sound.data = sound

      return { data: effect }
    })

  // フレームデータの生成
  const frameCellList = []
  // まずは念のため、Fr>Noでソートをかける
  animeData.cells
    .sort((a, b) => {
      const diff = a.frame - b.frame
      if (diff !== 0) {
        return diff
      }
      return a.no - b.no
    })
    .filter((cellData) => {
      // フレームが0以下になるセルを除外
      // cellData(UI)の時点では、フレームは1始まりなので、0も除外する
      return cellData.frame > 0
    })
    .forEach((cellData) => {
      const cell = getEmptyData(tk2k.ANIME_CEL)
      cell.visible.data = cellData.visible ? 1 : 0
      if (cellData.visible) {
        cell.pattern.data = clamp(cellData.pattern, 1, 25) - 1
        cell.x.data = cellData.x
        cell.y.data = cellData.y
        cell.scale.data = clamp(cellData.scale, 0, Infinity)
        cell.alpha.data = clamp(cellData.alpha, 0, 100)
        cell.r.data = clamp(cellData.r, 0, 200)
        cell.g.data = clamp(cellData.g, 0, 200)
        cell.b.data = clamp(cellData.b, 0, 200)
        cell.sat.data = clamp(cellData.sat, 0, 200)
      }

      const frameNo = cellData.frame - 1
      if (!Array.isArray(frameCellList[frameNo])) {
        frameCellList[frameNo] = []
      }
      frameCellList[frameNo].push({ id: cellData.no, data: cell })
    })

  const frameListData = []
  // 足りないフレームを埋めるため、forで回す
  for (const [frameNo, cellList] of frameCellList.entries()) {
    const frame = getEmptyData(tk2k.ANIME_FRAME)
    if (cellList) {
      frame.celList.data = cellList
    } else {
      frame.celList.data = []
    }
    frameListData.push({ id: frameNo + 1, data: frame })
  }
  // 元のフレーム数の方が大きい場合、空フレームを追加する
  if (animeData.frame > frameCellList.length) {
    for (let frameNo = frameCellList.length; frameNo < animeData.frame; frameNo++) {
      const frame = getEmptyData(tk2k.ANIME_FRAME)
      frame.celList.data = []
      frameListData.push({ id: frameNo + 1, data: frame })
    }
  }

  anime.frameList.data = frameListData

  return write(tk2k.ANIME, anime)
    .then(() => {
      console.log('done')
      return true
    })
    .catch((error) => {
      dialog.showErrorBox(
        'エラー',
        ['データコピーに失敗しました', `Error: ${error.text}`].join('\\n')
      )
      return false
    })
})

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}
